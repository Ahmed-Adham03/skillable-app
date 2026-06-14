from sqlalchemy import Column, Integer, String, DateTime, func, JSON, Text
from sqlalchemy.dialects.mysql import LONGTEXT
from app.db.session import Base

ProfileImageType = Text().with_variant(LONGTEXT, "mysql")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    profile_image = Column(ProfileImageType, nullable=True)
    phone_number = Column(String(50), nullable=False, default="N/A")
    address = Column(String(255), nullable=False, default="N/A")
    mobility = Column(String(100), nullable=False, default="N/A")
    vision = Column(String(100), nullable=False, default="N/A")
    hearing = Column(String(100), nullable=False, default="N/A")
    cognitive = Column(String(100), nullable=False, default="N/A")
    experience_level = Column(String(50), nullable=False, default="N/A")
    skills = Column(JSON, nullable=False, default=list)
    learning_plans = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
