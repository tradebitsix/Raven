from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    role: str = "Admin"
    email: Optional[EmailStr] = None

class UserCreate(UserBase):
    password: str | None = None

class UserUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    email: EmailStr | None = None
    password: str | None = None

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
