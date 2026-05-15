from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.work_pathway import WorkPathway
from app.schemas.work_pathway import WorkPathwayOut

router = APIRouter(prefix="/work-pathways", tags=["work-pathways"])


def _localized(pathway: WorkPathway, lang: str):
    data = {
        "id": pathway.id,
        "title": pathway.title,
        "tagline": pathway.tagline,
        "description": pathway.description,
        "color": pathway.color,
        "icon_key": pathway.icon_key,
        "difficulty": pathway.difficulty,
        "duration": pathway.duration,
        "skills": pathway.skills,
        "phases": pathway.phases,
        "requirements": pathway.requirements,
        "resources": pathway.resources,
        "workplace_types": pathway.workplace_types,
        "real_places": pathway.real_places,
        "accessibility_fit": pathway.accessibility_fit,
        "sort_order": pathway.sort_order,
    }
    if (lang or "").lower().startswith("ar"):
        for field in [
            "title", "tagline", "description", "difficulty", "duration",
            "skills", "phases", "requirements", "resources",
            "workplace_types", "real_places", "accessibility_fit",
        ]:
            arabic_value = getattr(pathway, f"{field}_ar", None)
            if arabic_value:
                data[field] = arabic_value
    return data


@router.get("", response_model=list[WorkPathwayOut])
def list_work_pathways(
    lang: str = Query("en", max_length=8),
    db: Session = Depends(get_db),
):
    pathways = db.query(WorkPathway).order_by(WorkPathway.sort_order, WorkPathway.title).all()
    return [_localized(pathway, lang) for pathway in pathways]


@router.get("/{pathway_id}", response_model=WorkPathwayOut)
def get_work_pathway(
    pathway_id: str,
    lang: str = Query("en", max_length=8),
    db: Session = Depends(get_db),
):
    pathway = db.query(WorkPathway).filter(WorkPathway.id == pathway_id).first()
    if not pathway:
        raise HTTPException(status_code=404, detail="Work pathway not found")
    return _localized(pathway, lang)
