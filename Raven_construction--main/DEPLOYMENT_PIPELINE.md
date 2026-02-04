# Raven Construction — Deploy Pipeline (Monorepo)

This repo is a **split monorepo**:

- `backend/` = FastAPI + Alembic + Postgres
- `frontend/` = Next.js UI

The two failures you saw (`uvicorn: not found`, DB auth errors) come from two root causes:

1) **Railway building from the wrong directory** (so `backend/requirements.txt` never got installed)
2) **Database variables edited manually** instead of using a single `DATABASE_URL` reference

---

## 1) Railway Backend (FastAPI)

### A. Create services

1. Create a new Railway project.
2. Add **Postgres**.
3. Add a **GitHub service** from this repo (the API service).

### B. Set the API service Root Directory

In the **API service** settings:

- **Root Directory**: `backend`

This is non-negotiable. If Railway builds from repo root, it will not install the backend deps.

### C. Set the Start Command

In the **API service → Deploy → Custom Start Command**:

```bash
sh -lc "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
```

### D. Pre-deploy migration command (optional but recommended)

In the **API service → Deploy → Pre-deploy Command**:

```bash
python -m alembic -c alembic.ini upgrade head
```

### E. Environment variables (API service)

Set only these:

- `ENV=production`
- `JWT_SECRET=<your-long-random-secret>`
- `CORS_ORIGINS=https://<your-vercel-domain>`

For the database:

- Add a variable named `DATABASE_URL`
- Set its value as a **Variable Reference** to the Postgres service's `DATABASE_URL`

Do **not** manually create `PGHOST`, `PGUSER`, `PGPASSWORD`, `postgres`, etc. The API should use `DATABASE_URL` only.

### F. Health check

After deploy:

- `https://<railway-domain>/api/health` must return `200 OK`
- `https://<railway-domain>/docs` must load

---

## 2) Railway Postgres

If you deleted too much and Postgres says "superuser password is not specified":

In the **Postgres service → Variables**, set:

```text
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD_HERE
```

Nothing else is required.

Do **not** set `POSTGRES_HOST_AUTH_METHOD=trust`.

---

## 3) Vercel Frontend (Next.js)

### A. Import

Import the repo in Vercel.

### B. Root Directory

Set **Root Directory** to:

- `frontend`

### C. Environment variables

Set:

```text
NEXT_PUBLIC_API_URL=https://<railway-domain>
```

Important:

- **Include `https://`**
- **Do NOT add `/api`** (frontend code appends `/api` itself)

---

## 4) Quick sanity check list (5 mins)

1. Railway Postgres running
2. Railway API root directory = `backend`
3. Railway API has `DATABASE_URL` (reference), `JWT_SECRET`, `CORS_ORIGINS`
4. Railway API start command uses `python -m uvicorn ... ${PORT:-8000}`
5. Vercel frontend root directory = `frontend`
6. Vercel has `NEXT_PUBLIC_API_URL=https://<railway-domain>`
7. `GET /api/health` works from browser
