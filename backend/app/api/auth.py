from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.auth import LoginIn, TokenOut
from app.core.config import settings
from app.core.security import verify_password, create_access_token
from app.db.session import get_db
from app.db import models
from app.api.deps import require_auth

# Standardized API contract:
#   POST /api/auth/login
#   GET  /api/auth/me
router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(subject=user.email, secret=settings.JWT_SECRET)
    return TokenOut(access_token=token)

@router.get("/me")
def me(user: models.User = Depends(require_auth)):
    return {"id": user.id, "email": user.email, "name": user.name, "role": user.role}
