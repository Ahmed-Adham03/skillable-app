from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.info import UserInfo
from app.schemas.info import InfoSave

router = APIRouter(prefix="/info", tags=["info"])


@router.post("/save", status_code=201)
def save_info(
    payload: InfoSave,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(UserInfo).filter(
        UserInfo.user_id == current_user.id,
        UserInfo.question_index == payload.question_index
    ).first()

    if existing:
        existing.answer = payload.answer
    else:
        db.add(UserInfo(
            user_id=current_user.id,
            question_index=payload.question_index,
            answer=payload.answer
        ))

    db.commit()
    return {"saved": True}
