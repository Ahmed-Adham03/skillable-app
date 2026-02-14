import csv
from pathlib import Path
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "jobs.csv"

LEVELS = {
    "no issues / n/a": 0,
    "n/a": 0,
    "mild": 1,
    "moderate": 2,
    "significant": 3,
    "requires support": 4
}

class MatchRequest(BaseModel):
    mobility: Optional[str] = None
    vision: Optional[str] = None
    hearing: Optional[str] = None
    cognitive: Optional[str] = None
    top_n: int = 6


app = FastAPI(title="Skillable Matching API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


def normalize_level(value: Optional[str]) -> Optional[int]:
    if value is None:
        return None
    key = value.strip().lower()
    if key == "":
        return None
    return LEVELS.get(key)


def load_jobs():
    jobs = []
    with DATA_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            jobs.append(row)
    return jobs


def score_job(job, user_levels):
    score = 0
    reasons = []
    max_score = 0
    for key in ["mobility", "vision", "hearing", "cognitive"]:
        user_level = user_levels.get(key)
        job_level = normalize_level(job.get(key))
        if user_level is None or job_level is None:
            reasons.append(f"{key.title()}: no preference")
            continue
        max_score += 2
        if job_level <= user_level:
            score += 2
            reasons.append(f"{key.title()}: fits your need")
        else:
            score -= 4
            reasons.append(f"{key.title()}: higher demand than your need")

    # Normalize to 0-100. If no dimensions were scored, set 50.
    if max_score == 0:
        percent = 50
    else:
        min_score = -2 * max_score
        percent = int(round(((score - min_score) / (max_score - min_score)) * 100))
    return score, percent, reasons


@app.get("/jobs")
def list_jobs():
    return load_jobs()


@app.post("/match")
def match_jobs(payload: MatchRequest):
    jobs = load_jobs()
    user_levels = {
        "mobility": normalize_level(payload.mobility),
        "vision": normalize_level(payload.vision),
        "hearing": normalize_level(payload.hearing),
        "cognitive": normalize_level(payload.cognitive)
    }

    results = []
    for job in jobs:
        score, percent, reasons = score_job(job, user_levels)
        results.append({
            "jobtitle": job.get("jobtitle"),
            "summary": job.get("summary"),
            "details": job.get("details"),
            "location": job.get("location"),
            "learning_resource": job.get("learning_resource"),
            "skills": [s.strip() for s in (job.get("skills") or "").split(";") if s.strip()],
            "roadmap": [s.strip() for s in (job.get("roadmap") or "").split(";") if s.strip()],
            "needs": {
                "mobility": job.get("mobility"),
                "vision": job.get("vision"),
                "hearing": job.get("hearing"),
                "cognitive": job.get("cognitive")
            },
            "match_score": score,
            "match_percentage": percent,
            "why_matched": reasons
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[: payload.top_n]
