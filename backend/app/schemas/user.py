from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: int
    full_name: str | None = None
    email: EmailStr
    phone_number: str
    address: str
    mobility: str
    vision: str
    hearing: str
    cognitive: str

    class Config:
        from_attributes = True
