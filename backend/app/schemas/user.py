from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: int
    full_name: str | None = None
    email: EmailStr
    role: str = "job_seeker"
    profile_image: str | None = None
    phone_number: str
    address: str
    mobility: str
    vision: str
    hearing: str
    cognitive: str
    experience_level: str
    skills: list
    learning_plans: list

    class Config:
        from_attributes = True
