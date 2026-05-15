from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.db.session import Base


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    contact_name = Column(String(255), nullable=False)
    organization_name = Column(String(255), nullable=False, default="N/A")
    organization_type = Column(String(120), nullable=False, default="Employer")
    phone_number = Column(String(50), nullable=False, default="N/A")
    website = Column(String(255), nullable=False, default="N/A")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="recruiter_profile")
