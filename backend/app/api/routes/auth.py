from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, Token
from app.schemas.user import UserOut
from app.schemas.profile import ProfileUpdate

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        phone_number="N/A",
        address="N/A",
        mobility="N/A",
        vision="N/A",
        hearing="N/A",
        cognitive="N/A"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(subject=user.email)
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    GOVERNORATES = {
        "N/A",
        "Cairo",
        "Giza",
        "Alexandria",
        "Dakahlia",
        "Red Sea",
        "Beheira",
        "Fayoum",
        "Gharbia",
        "Ismailia",
        "Menoufia",
        "Minya",
        "Qalyubia",
        "New Valley",
        "Suez",
        "Aswan",
        "Assiut",
        "Beni Suef",
        "Port Said",
        "Damietta",
        "Sharkia",
        "South Sinai",
        "Kafr El Sheikh",
        "Matrouh",
        "Luxor",
        "Qena",
        "North Sinai",
        "Sohag"
    }

    def normalize(value: str | None) -> str:
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

    current_user.full_name = full_name
    current_user.phone_number = phone_number
    current_user.address = address
    current_user.mobility = normalize(payload.mobility)
    current_user.vision = normalize(payload.vision)
    current_user.hearing = normalize(payload.hearing)
    current_user.cognitive = normalize(payload.cognitive)

    db.commit()
    db.refresh(current_user)
    return current_user
