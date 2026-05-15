from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    full_name: str | None = None
    email: EmailStr
    password: str = Field(min_length=8)
    role: str = "job_seeker"


class CompleteRegister(BaseModel):
    email: EmailStr
    code: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
