from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate
from app.api.deps import require_auth

router = APIRouter(tags=["projects"])

@router.get("", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db), _=Depends(require_auth)):
    return db.query(models.Project).order_by(models.Project.id.desc()).all()

@router.post("", response_model=ProjectOut)
def create_project(data: ProjectCreate, db: Session = Depends(get_db), _=Depends(require_auth)):
    p = models.Project(name=data.name)
    db.add(p); db.commit(); db.refresh(p)
    return p

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db), _=Depends(require_auth)):
    p = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not p:
        raise HTTPException(404, "Not found")
    return p

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db), _=Depends(require_auth)):
    p = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not p:
        raise HTTPException(404, "Not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    db.commit(); db.refresh(p)
    return p

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), _=Depends(require_auth)):
    p = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not p:
        raise HTTPException(404, "Not found")
    db.delete(p); db.commit()
    return {"deleted": True}
