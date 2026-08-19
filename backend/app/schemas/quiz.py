from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: int

class QuizCreate(QuizBase):
    pass

class QuizOut(QuizBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True