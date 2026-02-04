from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db import models
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.core.security import hash_password
from app.api.deps import require_auth

router = APIRouter(tags=["users"])


def has_any_users(db: Session) -> bool:
    return db.query(models.User.id).first() is not None


@router.get("", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _current_user=Depends(require_auth),
):
    return db.query(models.User).order_by(models.User.id.desc()).all()


@router.post("", response_model=UserOut)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_auth),
):
    # BOOTSTRAP: allow creating the very first user with no token
    if not has_any_users(db):
        current_user = None

    # After first user exists, token is required (require_auth already enforces it)
    # If token missing/invalid, request never reaches here.

    # Optional: force first user to be admin
    if current_user is None:
        try:
            data.role = "admin"
        except Exception:
            pass

    u = models.User(name=data.name, role=data.role, email=data.email)

    if data.password:
        u.password_hash = hash_password(data.password)

    db.add(u)
    db.commit()
    db.refresh(u)
    return u


@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _current_user=Depends(require_auth),
):
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Not found")
    return u


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    _current_user=Depends(require_auth),
):
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Not found")

    for k, v in data.model_dump(exclude_unset=True).items():
        if k == "password":
            if v:
                u.password_hash = hash_password(v)
        else:
            setattr(u, k, v)

    db.commit()
    db.refresh(u)
    return u


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _current_user=Depends(require_auth),
):
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(u)
    db.commit()
    return {"deleted": True}