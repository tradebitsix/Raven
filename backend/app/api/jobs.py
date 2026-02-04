from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.schemas.job import JobCreate, JobOut, JobUpdate
from app.api.deps import require_auth

router = APIRouter(tags=["jobs"])

@router.get("", response_model=list[JobOut])
def list_jobs(db: Session = Depends(get_db), _=Depends(require_auth)):
    return db.query(models.Job).order_by(models.Job.id.desc()).all()

@router.post("", response_model=JobOut)
def create_job(data: JobCreate, db: Session = Depends(get_db), _=Depends(require_auth)):
    j = models.Job(**data.model_dump())
    db.add(j); db.commit(); db.refresh(j)
    return j

@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db), _=Depends(require_auth)):
    j = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not j:
        raise HTTPException(404, "Not found")
    return j

@router.put("/{job_id}", response_model=JobOut)
def update_job(job_id: int, data: JobUpdate, db: Session = Depends(get_db), _=Depends(require_auth)):
    j = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not j:
        raise HTTPException(404, "Not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(j, k, v)
    db.commit(); db.refresh(j)
    return j

@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db), _=Depends(require_auth)):
    j = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not j:
        raise HTTPException(404, "Not found")
    db.delete(j); db.commit()
    return {"deleted": True}
