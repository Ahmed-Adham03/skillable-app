from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, Text, func

from app.db.session import Base


class OpenJob(Base):
    __tablename__ = "open_jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    contact_email = Column(String(255), nullable=False, default="N/A")
    about = Column(Text, nullable=False)
    skills = Column(JSON, nullable=False, default=list)
    logo_key = Column(String(80), nullable=False, default="briefcase-indigo")
    duration = Column(String(120), nullable=False)
    level = Column(String(80), nullable=False)
    location = Column(String(255), nullable=False, default="Egypt")
    job_type = Column(String(120), nullable=False, default="Open role")
    salary_range = Column(String(120), nullable=False, default="Not specified")
    is_open = Column(Boolean, nullable=False, default=True)
    created_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    recruiter_profile_id = Column(Integer, ForeignKey("recruiter_profiles.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
