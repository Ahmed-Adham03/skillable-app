# Skillable FastAPI Backend

## Setup
1. Create a MySQL database named `Skillable` (e.g. in MySQL Workbench).
2. Copy `.env.example` to `.env` and update credentials.
3. Install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run
```bash
uvicorn app.main:app --reload --port 8000
```

## Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (requires `Authorization: Bearer <token>`) 
