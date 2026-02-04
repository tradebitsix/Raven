from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    name: str
    builder: Optional[str] = None
    roof_type: Optional[str] = None
    pitch: Optional[int] = None
    area_sq_ft: Optional[int] = None
    status: str = "Draft"
    project_id: Optional[int] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    name: str | None = None
    builder: str | None = None
    roof_type: str | None = None
    pitch: int | None = None
    area_sq_ft: int | None = None
    status: str | None = None
    project_id: int | None = None

class JobOut(JobBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
