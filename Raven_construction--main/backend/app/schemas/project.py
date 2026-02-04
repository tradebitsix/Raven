from pydantic import BaseModel
from datetime import datetime

class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: str | None = None

class ProjectOut(ProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
