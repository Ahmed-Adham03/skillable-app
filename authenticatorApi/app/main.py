import random
import sqlite3
import time
from pathlib import Path
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "auth.db"
CODE_TTL_SECONDS = 30

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
            created_at INTEGER NOT NULL,
            used INTEGER NOT NULL DEFAULT 0
        )
        """
    )
    conn.commit()
    conn.close()


def generate_code() -> str:
    return f"{random.randint(0, 999999):06d}"


def insert_code(code: str):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO codes (code, created_at, used) VALUES (?, ?, 0)",
        (code, int(time.time()))
    )
    conn.commit()
    conn.close()


def get_latest_code() -> Optional[tuple]:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT id, code, created_at, used FROM codes ORDER BY id DESC LIMIT 1")
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
    _, _, created_at, used = row
    if used:
        return False
    return (int(time.time()) - created_at) <= CODE_TTL_SECONDS


class ValidateRequest(BaseModel):
    code: str


@app.on_event("startup")
def on_startup():
    init_db()
    if not get_latest_code():
        insert_code(generate_code())


@app.get("/current")
def current_code():
    row = get_latest_code()
    if not row:
        code = generate_code()
        insert_code(code)
        row = get_latest_code()
    if row and not is_valid(row):
        insert_code(generate_code())
        row = get_latest_code()
    code_id, code, created_at, used = row
    expires_in = max(0, CODE_TTL_SECONDS - (int(time.time()) - created_at))
    return {"code": code, "expires_in": expires_in, "used": bool(used)}


@app.post("/generate")
def generate():
    code = generate_code()
    insert_code(code)
    return {"code": code}


@app.post("/validate")
def validate(payload: ValidateRequest):
    row = get_latest_code()
    if not row or not is_valid(row) or row[1] != payload.code:
        return {"valid": False}
    mark_used(row[0])
    # rotate code immediately
    insert_code(generate_code())
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
    <div id=\"code\" class=\"code\">------</div>
    <div id=\"expires\"></div>
    <button onclick=\"generate()\">Generate New Code</button>
  </div>
<script>
async function refresh() {
  const res = await fetch('/current');
  const data = await res.json();
  document.getElementById('code').textContent = data.code;
  document.getElementById('expires').textContent = 'Expires in ' + data.expires_in + 's';
}
async function generate() {
  await fetch('/generate', { method: 'POST' });
  refresh();
}
setInterval(refresh, 1000);
refresh();
</script>
</body>
</html>
"""
