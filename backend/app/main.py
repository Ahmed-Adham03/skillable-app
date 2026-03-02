from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import CORS_ORIGINS
from app.db.session import Base, engine
from app.api.routes.auth import router as auth_router
from app.api.routes.oauth import router as oauth_router
from app.models import user  # noqa: F401

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

app.include_router(auth_router)
app.include_router(oauth_router)

@app.get("/")
def root():
    return {"status": "ok"}
