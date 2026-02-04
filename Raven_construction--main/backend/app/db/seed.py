import json
from pathlib import Path
from sqlalchemy.orm import Session
from app.db import models
from app.core.config import settings
from app.core.security import hash_password

MOCK_DIR = Path(__file__).resolve().parent / "mock_data"

def _load(name: str):
    p = MOCK_DIR / name
    if not p.exists():
        return []
    return json.loads(p.read_text(encoding="utf-8"))

def seed_if_empty(db: Session) -> None:
    # Seed admin user if no users exist
    if db.query(models.User).count() == 0:
        admin = models.User(
            name="Admin",
            email=settings.ADMIN_EMAIL,
            role="Admin",
            password_hash=hash_password(settings.ADMIN_PASSWORD),
        )
        db.add(admin)
        # Also seed any mock users
        for u in _load("users.json"):
            # mock has name/role only
            db.add(models.User(name=u.get("name","User"), role=u.get("role","Admin")))
        db.commit()

    # Seed projects
    if db.query(models.Project).count() == 0:
        for p in _load("projects.json"):
            db.add(models.Project(name=p.get("name","Project")))
        db.commit()

    # Seed jobs
    if db.query(models.Job).count() == 0:
        for j in _load("jobs.json"):
            db.add(models.Job(
                name=j.get("name","Job"),
                builder=j.get("builder"),
                roof_type=j.get("roofType"),
                pitch=j.get("pitch"),
                area_sq_ft=j.get("areaSqFt"),
                status="Draft"
            ))
        db.commit()
