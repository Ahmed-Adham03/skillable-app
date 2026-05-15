from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text, func

from app.db.session import Base


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    open_job_id = Column(Integer, ForeignKey("open_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    applicant_name = Column(String(255), nullable=False)
    applicant_email = Column(String(255), nullable=False)
    phone_number = Column(String(80), nullable=False, default="N/A")
    motivation = Column(Text, nullable=False)
    skills = Column(JSON, nullable=False, default=list)
    accessibility_notes = Column(Text, nullable=False, default="N/A")
    cv_link = Column(String(500), nullable=False, default="N/A")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
