import secrets

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import (
    GOOGLE_CLIENT_ID,
    LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
)
from app.core.security import create_access_token, get_password_hash
from app.models.user import User
from app.models.user_role import UserRole
from app.models.recruiter import RecruiterProfile
from app.schemas.auth import Token

router = APIRouter(prefix="/auth/oauth", tags=["oauth"])

def _find_or_create_user(db: Session, email: str, full_name: str, role: str = "job_seeker") -> tuple[User, bool]:
    user = db.query(User).filter(User.email == email).first()
    is_new_user = False
    if not user:
        is_new_user = True
        user = User(
            full_name=full_name or email.split("@")[0],
            email=email,
            password_hash=get_password_hash(secrets.token_hex(32)),
            phone_number="N/A",
            address="N/A",
            mobility="N/A",
            vision="N/A",
            hearing="N/A",
            cognitive="N/A",
            learning_plans=[],
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        normalized_role = "job_poster" if role == "job_poster" else "job_seeker"
        db.add(UserRole(user_id=user.id, role=normalized_role))
        if normalized_role == "job_poster":
            db.add(RecruiterProfile(
                user_id=user.id,
                contact_name=full_name or email.split("@")[0],
                organization_name=full_name or "N/A",
            ))
        db.commit()
    return user, is_new_user


# ── Google ────────────────────────────────────────────────────────────────────

class GooglePayload(BaseModel):
    id_token: str
    role: str | None = "job_seeker"


@router.post("/google", response_model=Token)
def google_login(payload: GooglePayload, db: Session = Depends(get_db)):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google sign-in is not configured.")

    # The frontend sends an OAuth2 access_token (implicit flow).
    # Verify it by fetching the userinfo endpoint.
    try:
        res = httpx.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {payload.id_token}"},
            timeout=10,
        )
        res.raise_for_status()
        info = res.json()
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token.")

    email = info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email.")

    user, is_new_user = _find_or_create_user(db, email, info.get("name", ""), role=payload.role or "job_seeker")
    return Token(access_token=create_access_token(subject=user.email), is_new_user=is_new_user)


# ── LinkedIn ──────────────────────────────────────────────────────────────────

class LinkedInPayload(BaseModel):
    code: str
    redirect_uri: str
    role: str | None = "job_seeker"


@router.post("/linkedin", response_model=Token)
def linkedin_login(payload: LinkedInPayload, db: Session = Depends(get_db)):
    if not LINKEDIN_CLIENT_ID or not LINKEDIN_CLIENT_SECRET:
        raise HTTPException(status_code=503, detail="LinkedIn sign-in is not configured.")

    # Exchange code for access token
    try:
        token_res = httpx.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            data={
                "grant_type": "authorization_code",
                "code": payload.code,
                "redirect_uri": payload.redirect_uri,
                "client_id": LINKEDIN_CLIENT_ID,
                "client_secret": LINKEDIN_CLIENT_SECRET,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10,
        )
        token_res.raise_for_status()
        access_token = token_res.json()["access_token"]
    except Exception:
        raise HTTPException(status_code=401, detail="Failed to exchange LinkedIn code.")

    # Fetch user info via OpenID Connect userinfo endpoint
    try:
        info_res = httpx.get(
            "https://api.linkedin.com/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        info_res.raise_for_status()
        info = info_res.json()
    except Exception:
        raise HTTPException(status_code=401, detail="Failed to fetch LinkedIn profile.")

    email = info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="LinkedIn account has no email. Enable the 'email' scope.")

    user, is_new_user = _find_or_create_user(db, email, info.get("name", ""), role=payload.role or "job_seeker")
    return Token(access_token=create_access_token(subject=user.email), is_new_user=is_new_user)


# ── Facebook ──────────────────────────────────────────────────────────────────

class FacebookPayload(BaseModel):
    code: str
    redirect_uri: str
    role: str | None = "job_seeker"


@router.post("/facebook", response_model=Token)
def facebook_login(payload: FacebookPayload, db: Session = Depends(get_db)):
    if not FACEBOOK_APP_ID or not FACEBOOK_APP_SECRET:
        raise HTTPException(status_code=503, detail="Facebook sign-in is not configured.")

    # Exchange code for access token
    try:
        token_res = httpx.get(
            "https://graph.facebook.com/v18.0/oauth/access_token",
            params={
                "client_id": FACEBOOK_APP_ID,
                "client_secret": FACEBOOK_APP_SECRET,
                "redirect_uri": payload.redirect_uri,
                "code": payload.code,
            },
            timeout=10,
        )
        token_res.raise_for_status()
        access_token = token_res.json()["access_token"]
    except Exception:
        raise HTTPException(status_code=401, detail="Failed to exchange Facebook code.")

    # Fetch user profile
    try:
        profile_res = httpx.get(
            "https://graph.facebook.com/me",
            params={"fields": "id,name,email", "access_token": access_token},
            timeout=10,
        )
        profile_res.raise_for_status()
        profile = profile_res.json()
    except Exception:
        raise HTTPException(status_code=401, detail="Failed to fetch Facebook profile.")

    email = profile.get("email")
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Facebook account has no email. Ensure the 'email' permission is granted.",
        )

    user, is_new_user = _find_or_create_user(db, email, profile.get("name", ""), role=payload.role or "job_seeker")
    return Token(access_token=create_access_token(subject=user.email), is_new_user=is_new_user)
