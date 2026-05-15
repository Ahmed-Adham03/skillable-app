from sqlalchemy import Column, Integer, String, Text, JSON

from app.db.session import Base


class WorkPathway(Base):
    __tablename__ = "accessible_work_pathways"

    id = Column(String(80), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_ar = Column(String(255), nullable=True)
    tagline = Column(String(500), nullable=False)
    tagline_ar = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    description_ar = Column(Text, nullable=True)
    color = Column(String(120), nullable=False)
    icon_key = Column(String(50), nullable=False)
    difficulty = Column(String(120), nullable=False)
    difficulty_ar = Column(String(120), nullable=True)
    duration = Column(String(120), nullable=False)
    duration_ar = Column(String(120), nullable=True)
    skills = Column(JSON, nullable=False, default=list)
    skills_ar = Column(JSON, nullable=True)
    phases = Column(JSON, nullable=False, default=list)
    phases_ar = Column(JSON, nullable=True)
    requirements = Column(JSON, nullable=False, default=list)
    requirements_ar = Column(JSON, nullable=True)
    resources = Column(JSON, nullable=False, default=list)
    resources_ar = Column(JSON, nullable=True)
    workplace_types = Column(JSON, nullable=False, default=list)
    workplace_types_ar = Column(JSON, nullable=True)
    real_places = Column(JSON, nullable=False, default=list)
    real_places_ar = Column(JSON, nullable=True)
    accessibility_fit = Column(JSON, nullable=False, default=list)
    accessibility_fit_ar = Column(JSON, nullable=True)
    sort_order = Column(Integer, nullable=False, default=0)
