from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.job_application import JobApplication
from app.models.open_job import OpenJob
from app.models.recruiter import RecruiterProfile
from app.models.user import User
from app.models.user_role import UserRole
from app.schemas.open_job import JobApplicationCreate, JobApplicationOut, OpenJobCreate, OpenJobOut, OpenJobUpdate

router = APIRouter(prefix="/open-jobs", tags=["open-jobs"])


def _clean_skills(skills: list) -> list[str]:
    cleaned = []
    seen = set()
    for skill in skills:
        if isinstance(skill, dict):
            skill = skill.get("name") or skill.get("label") or skill.get("title") or skill.get("value") or ""
        value = str(skill).strip()[:60]
        key = value.lower()
        if value and key not in seen:
            cleaned.append(value)
            seen.add(key)
        if len(cleaned) >= 30:
            break
    return cleaned


def _current_role(db: Session, user: User) -> str:
    role = db.query(UserRole).filter(UserRole.user_id == user.id).first()
    return "job_poster" if role and role.role == "job_poster" else "job_seeker"


def _require_poster(db: Session, user: User) -> str:
    current_role = _current_role(db, user)
    if current_role != "job_poster":
        raise HTTPException(status_code=403, detail="Only job posters can manage open jobs.")
    return current_role


def _require_job_owner(job: OpenJob, user: User):
    if job.created_by_id != user.id:
        raise HTTPException(status_code=403, detail="Only the recruiter who posted this job can edit it.")


@router.get("", response_model=list[OpenJobOut])
def list_open_jobs(db: Session = Depends(get_db)):
    return (
        db.query(OpenJob)
        .filter(OpenJob.is_open == True)  # noqa: E712
        .order_by(OpenJob.created_at.desc(), OpenJob.id.desc())
        .all()
    )


@router.get("/mine", response_model=list[OpenJobOut])
def list_my_open_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_poster(db, current_user)
    query = db.query(OpenJob)
    query = query.filter(OpenJob.created_by_id == current_user.id)
    return query.order_by(OpenJob.created_at.desc(), OpenJob.id.desc()).all()


@router.get("/{job_id}", response_model=OpenJobOut)
def get_open_job(job_id: int, db: Session = Depends(get_db)):
    job = (
        db.query(OpenJob)
        .filter(OpenJob.id == job_id, OpenJob.is_open == True)  # noqa: E712
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Open role not found.")
    return job


@router.post("", response_model=OpenJobOut, status_code=201)
def create_open_job(
    payload: OpenJobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_poster(db, current_user)
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter:
        recruiter = RecruiterProfile(
            user_id=current_user.id,
            contact_name=current_user.full_name or current_user.email,
            organization_name=payload.company_name.strip(),
        )
        db.add(recruiter)
        db.flush()

    job = OpenJob(
        title=payload.title.strip(),
        company_name=payload.company_name.strip(),
        contact_email=payload.contact_email.strip().lower(),
        about=payload.about.strip(),
        skills=_clean_skills(payload.skills),
        logo_key=payload.logo_key.strip() or "briefcase-indigo",
        duration=payload.duration.strip(),
        level=payload.level.strip(),
        location=(payload.location or "Egypt").strip(),
        job_type=(payload.job_type or "Open role").strip(),
        salary_range=(payload.salary_range or "Not specified").strip(),
        created_by_id=current_user.id,
        recruiter_profile_id=recruiter.id if recruiter else None,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.patch("/{job_id}", response_model=OpenJobOut)
def update_open_job(
    job_id: int,
    payload: OpenJobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_poster(db, current_user)
    job = db.query(OpenJob).filter(OpenJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Open role not found.")
    _require_job_owner(job, current_user)

    data = payload.model_dump(exclude_unset=True)
    if "title" in data:
        job.title = data["title"].strip()
    if "company_name" in data:
        job.company_name = data["company_name"].strip()
    if "contact_email" in data:
        job.contact_email = data["contact_email"].strip().lower()
    if "about" in data:
        job.about = data["about"].strip()
    if "skills" in data:
        job.skills = _clean_skills(data["skills"] or [])
    if "logo_key" in data:
        job.logo_key = (data["logo_key"] or "briefcase-indigo").strip() or "briefcase-indigo"
    if "duration" in data:
        job.duration = data["duration"].strip()
    if "level" in data:
        job.level = data["level"].strip()
    if "location" in data:
        job.location = (data["location"] or "Egypt").strip()
    if "job_type" in data:
        job.job_type = (data["job_type"] or "Open role").strip()
    if "salary_range" in data:
        job.salary_range = (data["salary_range"] or "Not specified").strip()
    if "is_open" in data:
        job.is_open = data["is_open"]

    db.commit()
    db.refresh(job)
    return job


@router.post("/{job_id}/applications", response_model=JobApplicationOut, status_code=201)
def apply_to_open_job(
    job_id: int,
    payload: JobApplicationCreate,
    db: Session = Depends(get_db),
):
    job = (
        db.query(OpenJob)
        .filter(OpenJob.id == job_id, OpenJob.is_open == True)  # noqa: E712
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Open role not found.")

    application = JobApplication(
        open_job_id=job.id,
        applicant_name=payload.applicant_name.strip(),
        applicant_email=payload.applicant_email.strip().lower(),
        phone_number=(payload.phone_number or "N/A").strip() or "N/A",
        motivation=payload.motivation.strip(),
        skills=_clean_skills(payload.skills),
        accessibility_notes=(payload.accessibility_notes or "N/A").strip() or "N/A",
        cv_link=(payload.cv_link or "N/A").strip() or "N/A",
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/{job_id}/applications", response_model=list[JobApplicationOut])
def list_open_job_applications(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(OpenJob).filter(OpenJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Open role not found.")

    current_role = _current_role(db, current_user)
    if current_role != "job_poster":
        raise HTTPException(status_code=403, detail="Only job posters can view applications.")
    _require_job_owner(job, current_user)

    return (
        db.query(JobApplication)
        .filter(JobApplication.open_job_id == job.id)
        .order_by(JobApplication.created_at.desc(), JobApplication.id.desc())
        .all()
    )
