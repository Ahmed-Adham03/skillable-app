from pydantic import BaseModel


class WorkPathwayOut(BaseModel):
    id: str
    title: str
    tagline: str
    description: str
    color: str
    icon_key: str
    difficulty: str
    duration: str
    skills: list
    phases: list
    requirements: list
    resources: list
    workplace_types: list
    real_places: list
    accessibility_fit: list
    sort_order: int

    class Config:
        from_attributes = True
