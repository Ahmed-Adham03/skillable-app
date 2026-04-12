from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    full_name:        str | None  = None
    phone_number:     str | None  = None
    address:          str | None  = None
    mobility:         str | None  = None
    vision:           str | None  = None
    hearing:          str | None  = None
    cognitive:        str | None  = None
    experience_level: str | None  = None
    skills:           list | None = None
