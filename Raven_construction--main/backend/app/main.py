from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import get_db
from app.db.seed import seed_if_empty
from app.api import auth, jobs, projects, users


app = FastAPI(
    title="Raven Roofing Owner API",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _seed_on_startup():
    try:
        db = next(get_db())
        seed_if_empty(db)
        db.close()
    except Exception:
        pass


@app.get("/api/health")
def health():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(jobs.router, prefix="/api/jobs")
app.include_router(projects.router, prefix="/api/projects")
app.include_router(users.router, prefix="/api/users")