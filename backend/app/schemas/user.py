from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

from app.models.user import UserRole

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.STUDENT

class UserOut(UserBase):
    id: int
    role: UserRole
    is_active: bool
    interview_ban_until: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True