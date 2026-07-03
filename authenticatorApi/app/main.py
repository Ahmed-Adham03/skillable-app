import logging
import os
import random
import sqlite3
import time
from pathlib import Path
from typing import Optional

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Always load the .env next to this package, regardless of working directory
_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH)

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "auth.db"
CODE_TTL_SECONDS = 300
BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "")
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "Skillable")


class EmailDeliveryUncertain(RuntimeError):
    pass

app = FastAPI(title="Skillable Authenticator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            used INTEGER NOT NULL DEFAULT 0
        )
        """
    )
    try:
        conn.execute("ALTER TABLE codes ADD COLUMN email TEXT NOT NULL DEFAULT ''")
    except sqlite3.OperationalError:
        pass
    try:
        conn.execute("ALTER TABLE codes ADD COLUMN purpose TEXT NOT NULL DEFAULT 'verification'")
    except sqlite3.OperationalError:
        pass
    conn.commit()
    conn.close()


def generate_code() -> str:
    return f"{random.randint(0, 999999):06d}"


def insert_code(email: str, code: str, purpose: str):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO codes (code, email, purpose, created_at, used) VALUES (?, ?, ?, ?, 0)",
        (code, email, purpose, int(time.time()))
    )
    conn.commit()
    conn.close()


def get_latest_code(email: str, purpose: str = "verification") -> Optional[tuple]:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT id, code, email, purpose, created_at, used FROM codes WHERE email = ? AND purpose = ? ORDER BY id DESC LIMIT 1",
        (email, purpose)
    )
    row = cur.fetchone()
    conn.close()
    return row


def mark_used(code_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("UPDATE codes SET used = 1 WHERE id = ?", (code_id,))
    conn.commit()
    conn.close()


def is_valid(row) -> bool:
    if not row:
        return False
    _, _, _, _, created_at, used = row
    if used:
        return False
    return (int(time.time()) - created_at) <= CODE_TTL_SECONDS


class ValidateRequest(BaseModel):
    email: EmailStr
    code: str
    purpose: str = "verification"


class SendRequest(BaseModel):
    email: EmailStr
    purpose: str = "verification"


def normalize_purpose(purpose: str | None) -> str:
    return "password_reset" if purpose == "password_reset" else "verification"


@app.on_event("startup")
def on_startup():
    init_db()
    if not BREVO_API_KEY or not BREVO_SENDER_EMAIL:
        logger.error("BREVO_API_KEY or BREVO_SENDER_EMAIL is missing — emails will not be sent!")
    else:
        logger.info("Authenticator ready. Sender: %s", BREVO_SENDER_EMAIL)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "brevo_configured": bool(BREVO_API_KEY and BREVO_SENDER_EMAIL),
        "sender": BREVO_SENDER_EMAIL or "NOT SET",
    }
    # No default codes; generated per email on demand.


@app.get("/current")
def current_code(email: EmailStr, purpose: str = "verification"):
    row = get_latest_code(email, normalize_purpose(purpose))
    if not row:
        return {"code": None, "expires_in": 0, "used": False}
    if row and not is_valid(row):
        return {"code": None, "expires_in": 0, "used": False}
    _, code, _, _, created_at, used = row
    expires_in = max(0, CODE_TTL_SECONDS - (int(time.time()) - created_at))
    return {"code": code, "expires_in": expires_in, "used": bool(used)}


def invalidate_codes(email: str, purpose: str = "verification"):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("UPDATE codes SET used = 1 WHERE email = ? AND purpose = ?", (email, purpose))
    conn.commit()
    conn.close()


def send_email(to_email: str, code: str, purpose: str = "verification"):
    if not BREVO_API_KEY or not BREVO_SENDER_EMAIL:
        raise RuntimeError("Brevo API is not configured.")
    if purpose == "password_reset":
        subject = "Your Skillable password reset code"
        body = (
            f"Your password reset code is: {code}\n\n"
            f"This code expires in {CODE_TTL_SECONDS // 60} minutes.\n"
            f"If you did not request a password reset, ignore this email."
        )
    else:
        subject = "Your Skillable verification code"
        body = (
            f"Your Skillable verification code is: {code}\n\n"
            f"This code expires in {CODE_TTL_SECONDS // 60} minutes.\n"
            f"If you did not request this, ignore this email."
        )
    payload = {
        "sender": {"name": BREVO_SENDER_NAME, "email": BREVO_SENDER_EMAIL},
        "to": [{"email": to_email}],
        "subject": subject,
        "textContent": body,
    }
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }
    try:
        response = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            json=payload,
            headers=headers,
            timeout=25,
        )
        if response.status_code < 300:
            logger.info("Email sent to %s", to_email)
            return
        logger.error("Brevo rejected email: %s %s", response.status_code, response.text)
        raise RuntimeError(f"Brevo error {response.status_code}: {response.text}")
    except requests.Timeout as e:
        logger.error("Brevo request timed out for %s: %s", to_email, e)
        raise EmailDeliveryUncertain(f"Brevo delivery status is uncertain: {e}")
    except requests.RequestException as e:
        logger.error("Brevo request failed: %s", e)
        raise RuntimeError(f"Could not reach email service: {e}")


@app.post("/send")
def send_code(payload: SendRequest):
    purpose = normalize_purpose(payload.purpose)
    code = generate_code()
    invalidate_codes(payload.email, purpose)
    insert_code(payload.email, code, purpose)
    try:
        send_email(payload.email, code, purpose)
    except EmailDeliveryUncertain as e:
        logger.warning("Email delivery status uncertain for %s: %s", payload.email, e)
        if purpose == "password_reset":
            return {"sent": True, "expires_in": CODE_TTL_SECONDS, "delivery_uncertain": True}
        invalidate_codes(payload.email, purpose)
        raise HTTPException(status_code=503, detail="Could not confirm verification email delivery. Please try again.")
    except RuntimeError as e:
        logger.error("Email delivery failed for %s: %s", payload.email, e)
        # Invalidate the code we just inserted so the DB stays clean
        invalidate_codes(payload.email, purpose)
        raise HTTPException(status_code=503, detail="Could not send verification email. Please try again.")
    return {"sent": True, "expires_in": CODE_TTL_SECONDS}


@app.post("/validate")
def validate(payload: ValidateRequest):
    row = get_latest_code(payload.email, normalize_purpose(payload.purpose))
    if not row or not is_valid(row) or row[1] != payload.code:
        return {"valid": False}
    mark_used(row[0])
    return {"valid": True}


@app.get("/", response_class=HTMLResponse)
def index():
    return """
<!doctype html>
<html>
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>Skillable Authenticator</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; }
    .card { max-width: 420px; border: 1px solid #ddd; border-radius: 16px; padding: 24px; }
    .code { font-size: 36px; font-weight: 700; letter-spacing: 4px; margin: 12px 0; }
    button { padding: 8px 12px; border-radius: 8px; border: 1px solid #444; background: #fff; }
  </style>
</head>
<body>
  <div class=\"card\">
    <h2>Authenticator Code</h2>
    <label>Email</label>
    <input id=\"email\" type=\"email\" style=\"width:100%;padding:8px;margin-top:8px;margin-bottom:12px;\" placeholder=\"you@example.com\" />
    <div id=\"code\" class=\"code\">------</div>
    <div id=\"expires\"></div>
    <button onclick=\"send()\">Send Code</button>
  </div>
<script>
async function refresh() {
  const email = document.getElementById('email').value.trim();
  if (!email) return;
  const res = await fetch('/current?email=' + encodeURIComponent(email));
  const data = await res.json();
  document.getElementById('code').textContent = data.code || '------';
  document.getElementById('expires').textContent = data.code ? ('Expires in ' + data.expires_in + 's') : '';
}
async function send() {
  const email = document.getElementById('email').value.trim();
  if (!email) return;
  await fetch('/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
  refresh();
}
setInterval(refresh, 1000);
</script>
</body>
</html>
"""
