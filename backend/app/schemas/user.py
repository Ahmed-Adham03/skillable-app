from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: int
    full_name: str | None = None
    email: EmailStr

    class Config:
        from_attributes = True
