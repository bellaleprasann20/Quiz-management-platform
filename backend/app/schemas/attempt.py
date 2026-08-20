from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Embedded Answer Schemas ---
class AnswerBase(BaseModel):
    question_id: int
    selected_option: Optional[str] = None

class AnswerCreate(AnswerBase):
    pass

class AnswerOut(AnswerBase):
    id: int
    attempt_id: int

    class Config:
        from_attributes = True


# --- Attempt Schemas ---
class AttemptBase(BaseModel):
    quiz_id: int

class AttemptCreate(AttemptBase):
    pass

class AttemptSubmit(BaseModel):
    score: int
    answers: Optional[List[AnswerCreate]] = None

class AttemptOut(AttemptBase):
    id: int
    user_id: int
    score: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    answers: List[AnswerOut] = []

    class Config:
        from_attributes = True