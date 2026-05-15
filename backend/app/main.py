from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import CORS_ORIGINS
from app.db.session import Base, engine
from app.api.routes.auth import router as auth_router
from app.api.routes.oauth import router as oauth_router
from app.api.routes.info import router as info_router
from app.api.routes.work_pathways import router as work_pathways_router
from app.api.routes.open_jobs import router as open_jobs_router
from app.models import user  # noqa: F401
from app.models import user_role  # noqa: F401
from app.models import recruiter  # noqa: F401
from app.models import info  # noqa: F401
from app.models import work_pathway  # noqa: F401
from app.models import open_job  # noqa: F401
from app.models import job_application  # noqa: F401
from app.db.session import SessionLocal
from app.db.seed_work_pathways import seed_work_pathways
from app.db.runtime_columns import ensure_runtime_records

app = FastAPI(title="Skillable API")

origins = [origin.strip() for origin in CORS_ORIGINS.split(",") if origin.strip()]
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        ensure_runtime_records(db)
        seed_work_pathways(db)
    finally:
        db.close()

app.include_router(auth_router)
app.include_router(oauth_router)
app.include_router(info_router)
app.include_router(work_pathways_router)
app.include_router(open_jobs_router)

@app.get("/")
def root():
    return {"status": "ok"}
