import base64
import hashlib
import os

from cryptography.fernet import Fernet, InvalidToken

from app.core.config import SECRET_KEY


ENCRYPTED_PREFIX = "enc:"
SENSITIVE_PROFILE_FIELDS = ["phone_number", "address", "mobility", "vision", "hearing", "cognitive"]


def _fernet() -> Fernet:
    configured_key = os.getenv("FIELD_ENCRYPTION_KEY", "").strip()
    if configured_key:
        return Fernet(configured_key.encode("utf-8"))

    digest = hashlib.sha256(SECRET_KEY.encode("utf-8")).digest()
    derived_key = base64.urlsafe_b64encode(digest)
    return Fernet(derived_key)


def encrypt_field(value: str | None) -> str:
    normalized = (value or "").strip() or "N/A"
    if normalized == "N/A" or normalized.startswith(ENCRYPTED_PREFIX):
        return normalized
    token = _fernet().encrypt(normalized.encode("utf-8")).decode("utf-8")
    return f"{ENCRYPTED_PREFIX}{token}"


def decrypt_field(value: str | None) -> str:
    if not value:
        return "N/A"
    if not value.startswith(ENCRYPTED_PREFIX):
        return value
    token = value[len(ENCRYPTED_PREFIX):]
    try:
        return _fernet().decrypt(token.encode("utf-8")).decode("utf-8")
    except (InvalidToken, ValueError):
        return "N/A"
