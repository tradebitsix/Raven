# Raven Roofing Owner SaaS (Full Stack)

This is a generation-complete, production-intent codebase:
- Backend: FastAPI + PostgreSQL + Alembic + JWT auth
- Frontend: Next.js 14 (App Router) + Tailwind + React Query + Zod

**Verification must be run in a real execution environment. No verification is claimed here.**

## Repo Structure
- `backend/` FastAPI API (`/api/*`)
- `frontend/` Next.js admin UI

---

## Local Run (External Verification Gates)

### 1) Backend
```bash
cd backend
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Health:
```bash
curl -sS http://localhost:8000/api/health
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Open:
- http://localhost:3000

Default admin is seeded from backend env:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

---

## Deployment (No Claims)

### Railway (Backend + Postgres)
1) Create a Railway project
2) Add a PostgreSQL database
3) Set backend service root directory to `backend`
4) Set env vars (see `backend/.env.example`)
5) Start command:
```bash
sh -lc 'alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}'
```

### Vercel (Frontend)
1) Import repo in Vercel
2) Set root directory to `frontend`
3) Set env var:
- `NEXT_PUBLIC_API_URL` = `https://<your-railway-backend-domain>/api`
4) Deploy

---

## Integrity Statement
This deliverable is generation-complete but not verification-certified.
All verification gates must be executed externally before production use.
