from pydantic import BaseModel, Field


class OpenJobCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    company_name: str = Field(..., min_length=2, max_length=255)
    contact_email: str = Field(..., min_length=5, max_length=255, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    about: str = Field(..., min_length=20, max_length=4000)
    skills: list[str] = Field(default_factory=list)
    logo_key: str = Field(default="briefcase-indigo", max_length=80)
    duration: str = Field(..., min_length=2, max_length=120)
    level: str = Field(..., min_length=2, max_length=80)
    location: str = Field(default="Egypt", max_length=255)
    job_type: str = Field(default="Open role", max_length=120)
    salary_range: str = Field(default="Not specified", max_length=120)


class OpenJobUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=255)
    company_name: str | None = Field(default=None, min_length=2, max_length=255)
    contact_email: str | None = Field(default=None, min_length=5, max_length=255, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    about: str | None = Field(default=None, min_length=20, max_length=4000)
    skills: list[str] | None = None
    logo_key: str | None = Field(default=None, max_length=80)
    duration: str | None = Field(default=None, min_length=2, max_length=120)
    level: str | None = Field(default=None, min_length=2, max_length=80)
    location: str | None = Field(default=None, max_length=255)
    job_type: str | None = Field(default=None, max_length=120)
    salary_range: str | None = Field(default=None, max_length=120)
    is_open: bool | None = None


class OpenJobOut(BaseModel):
    id: int
    title: str
    company_name: str
    contact_email: str
    about: str
    skills: list
    logo_key: str
    duration: str
    level: str
    location: str
    job_type: str
    salary_range: str
    is_open: bool
    created_by_id: int | None = None
    recruiter_profile_id: int | None = None

    class Config:
        from_attributes = True


class JobApplicationCreate(BaseModel):
    applicant_name: str = Field(..., min_length=2, max_length=255)
    applicant_email: str = Field(..., min_length=5, max_length=255, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    phone_number: str = Field(default="N/A", max_length=80)
    motivation: str = Field(..., min_length=20, max_length=3000)
    skills: list[str] = Field(default_factory=list)
    accessibility_notes: str = Field(default="N/A", max_length=3000)
    cv_link: str = Field(default="N/A", max_length=500)


class JobApplicationOut(BaseModel):
    id: int
    open_job_id: int
    applicant_name: str
    applicant_email: str
    phone_number: str
    motivation: str
    skills: list
    accessibility_notes: str
    cv_link: str

    class Config:
        from_attributes = True
