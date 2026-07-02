from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.core.field_encryption import ENCRYPTED_PREFIX, SENSITIVE_PROFILE_FIELDS, encrypt_field
from app.models.user import User
from app.models.user_role import UserRole
from app.models.recruiter import RecruiterProfile
from app.models.open_job import OpenJob


def ensure_runtime_records(db: Session):
    inspector = inspect(db.bind)
    user_columns = {column["name"] for column in inspector.get_columns(User.__tablename__)}
    has_legacy_role = "role" in user_columns
    table_names = set(inspector.get_table_names())

    if User.__tablename__ in table_names and "profile_image" not in user_columns:
        column_type = "LONGTEXT" if db.bind.dialect.name == "mysql" else "TEXT"
        db.execute(text(f"ALTER TABLE users ADD COLUMN profile_image {column_type} NULL"))
        db.commit()
        user_columns.add("profile_image")
    elif User.__tablename__ in table_names and "profile_image" in user_columns and db.bind.dialect.name == "mysql":
        db.execute(text("ALTER TABLE users MODIFY COLUMN profile_image LONGTEXT NULL"))
        db.commit()

    if User.__tablename__ in table_names and db.bind.dialect.name == "mysql":
        for column_name in SENSITIVE_PROFILE_FIELDS:
            if column_name in user_columns:
                db.execute(text(f"ALTER TABLE users MODIFY COLUMN {column_name} TEXT NOT NULL"))
        db.commit()

    if OpenJob.__tablename__ in table_names:
        open_job_columns = {column["name"] for column in inspector.get_columns(OpenJob.__tablename__)}
        if "contact_email" not in open_job_columns:
            db.execute(text("ALTER TABLE open_jobs ADD COLUMN contact_email VARCHAR(255) NOT NULL DEFAULT 'N/A'"))
            db.commit()
        if "recruiter_profile_id" not in open_job_columns:
            db.execute(text("ALTER TABLE open_jobs ADD COLUMN recruiter_profile_id INTEGER NULL"))
            db.commit()

    users = db.query(User).all()
    encrypted_any = False
    for user in users:
        for field_name in SENSITIVE_PROFILE_FIELDS:
            value = getattr(user, field_name, None)
            if value and value != "N/A" and not str(value).startswith(ENCRYPTED_PREFIX):
                setattr(user, field_name, encrypt_field(value))
                encrypted_any = True

        existing = db.query(UserRole).filter(UserRole.user_id == user.id).first()
        if existing:
            continue
        role = "job_seeker"
        if has_legacy_role:
            role = getattr(user, "role", None) or "job_seeker"
        db.add(UserRole(user_id=user.id, role=role if role == "job_poster" else "job_seeker"))
    db.commit()

    invalid_roles = db.query(UserRole).filter(~UserRole.role.in_(["job_seeker", "job_poster"])).all()
    for user_role in invalid_roles:
        user_role.role = "job_seeker"
    db.commit()

    poster_roles = db.query(UserRole).filter(UserRole.role == "job_poster").all()
    for user_role in poster_roles:
        existing_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user_role.user_id).first()
        if existing_profile:
            continue
        user = db.query(User).filter(User.id == user_role.user_id).first()
        if not user:
            continue
        db.add(RecruiterProfile(
            user_id=user.id,
            contact_name=user.full_name or user.email,
            organization_name=user.full_name or "N/A",
        ))
    db.commit()
