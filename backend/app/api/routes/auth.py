import time
from typing import Optional

import requests as http_requests
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.config import CODE_API_URL  # used for validate only
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.models.user_role import UserRole
from app.models.recruiter import RecruiterProfile
from app.schemas.auth import UserCreate, CompleteRegister, UserLogin, Token
from app.schemas.user import UserOut
from app.schemas.profile import ProfileUpdate

router = APIRouter(prefix="/auth", tags=["auth"])

# ---------------------------------------------------------------------------
# In-memory pending registration store
# { email -> {full_name, password_hash, created_at} }
# Entries expire after 10 minutes (longer than code TTL to allow resend)
# ---------------------------------------------------------------------------
_pending: dict = {}
_PENDING_TTL = 600  # 10 minutes


def _clean_pending():
    now = int(time.time())
    expired = [k for k, v in _pending.items() if now - v["created_at"] > _PENDING_TTL]
    for k in expired:
        del _pending[k]


def _validate_code(email: str, code: str) -> bool:
    """Call the authenticator service to validate a code. Returns True if valid."""
    try:
        res = http_requests.post(
            f"{CODE_API_URL}/validate",
            json={"email": email, "code": code},
            timeout=10,
        )
        if not res.ok:
            return False
        return res.json().get("valid", False)
    except http_requests.RequestException:
        return False


# ---------------------------------------------------------------------------
# Registration — two-step: initiate → complete
# ---------------------------------------------------------------------------

@router.post("/initiate-register", status_code=200)
def initiate_register(payload: UserCreate, db: Session = Depends(get_db)):
    """Step 1: validate email uniqueness and store pending data.
    The frontend is responsible for calling CODE_API/send directly.
    The user is NOT saved to the database here."""
    _clean_pending()
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    role = payload.role if payload.role in {"job_seeker", "job_poster"} else "job_seeker"

    _pending[payload.email] = {
        "full_name": payload.full_name or "",
        "password_hash": get_password_hash(payload.password),
        "role": role,
        "created_at": int(time.time()),
    }
    return {"pending": True}


@router.post("/complete-register", response_model=Token, status_code=201)
def complete_register(payload: CompleteRegister, db: Session = Depends(get_db)):
    """Step 2: validate the code, then (and only then) create the user."""
    pending = _pending.get(payload.email)
    if not pending:
        raise HTTPException(status_code=400, detail="No pending registration for this email. Please start again.")

    if int(time.time()) - pending["created_at"] > _PENDING_TTL:
        del _pending[payload.email]
        raise HTTPException(status_code=400, detail="Registration session expired. Please start again.")

    if not _validate_code(payload.email, payload.code):
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")

    # Code is valid — now create the user
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        # Edge case: registered via another method between initiate and complete
        del _pending[payload.email]
        raise HTTPException(status_code=400, detail="Email already registered.")

    user = User(
        full_name=pending["full_name"],
        email=payload.email,
        password_hash=pending["password_hash"],
        phone_number="N/A",
        address="N/A",
        mobility="N/A",
        vision="N/A",
        hearing="N/A",
        cognitive="N/A",
        experience_level="N/A",
        skills=[],
        learning_plans=[],
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.add(UserRole(user_id=user.id, role=pending.get("role", "job_seeker")))
    if pending.get("role") == "job_poster":
        db.add(RecruiterProfile(
            user_id=user.id,
            contact_name=pending["full_name"] or user.email,
            organization_name=pending["full_name"] or "N/A",
        ))
    db.commit()
    del _pending[payload.email]

    token = create_access_token(subject=user.email)
    return Token(access_token=token)


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(subject=user.email)
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def me(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.learning_plans is None:
        current_user.learning_plans = []
    role = db.query(UserRole).filter(UserRole.user_id == current_user.id).first()
    data = UserOut.model_validate(current_user).model_dump()
    data["role"] = role.role if role else "job_seeker"
    return data


@router.get("/learning-plans", response_model=list)
def get_learning_plans(current_user: User = Depends(get_current_user)):
    return current_user.learning_plans or []


@router.put("/learning-plans", response_model=list)
def update_learning_plans(
    payload: list = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.learning_plans = payload
    db.commit()
    db.refresh(current_user)
    return current_user.learning_plans or []


@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    GOVERNORATES = {
        "N/A", "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira",
        "Fayoum", "Gharbia", "Ismailia", "Menoufia", "Minya", "Qalyubia",
        "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said",
        "Damietta", "Sharkia", "South Sinai", "Kafr El Sheikh", "Matrouh",
        "Luxor", "Qena", "North Sinai", "Sohag",
    }

    def normalize(value: Optional[str]) -> str:
        if value is None:
            return "N/A"
        value = value.strip()
        return value if value else "N/A"

    full_name = normalize(payload.full_name)
    phone_number = normalize(payload.phone_number)
    address = normalize(payload.address)

    if phone_number != "N/A":
        if not phone_number.isdigit() or len(phone_number) != 11:
            raise HTTPException(status_code=400, detail="Phone number must be exactly 11 digits.")

    if address != "N/A" and address not in GOVERNORATES:
        raise HTTPException(status_code=400, detail="Address must be a valid Egyptian governorate.")

    valid_experience_levels = {"N/A", "Entry", "Mid", "Senior"}
    experience_level = normalize(payload.experience_level)
    if experience_level not in valid_experience_levels:
        raise HTTPException(status_code=400, detail="experience_level must be one of: Entry, Mid, Senior, N/A.")

    # Skills: deduplicate, strip whitespace, max 30 items, each max 60 chars
    raw_skills = payload.skills if isinstance(payload.skills, list) else []
    cleaned_skills = list({s.strip()[:60] for s in raw_skills if isinstance(s, str) and s.strip()})[:30]

    current_user.full_name        = full_name
    current_user.phone_number     = phone_number
    current_user.address          = address
    current_user.mobility         = normalize(payload.mobility)
    current_user.vision           = normalize(payload.vision)
    current_user.hearing          = normalize(payload.hearing)
    current_user.cognitive        = normalize(payload.cognitive)
    current_user.experience_level = experience_level
    current_user.skills           = cleaned_skills

    db.commit()
    db.refresh(current_user)
    return current_user
