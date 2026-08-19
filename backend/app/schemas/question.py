from pydantic import BaseModel
from typing import Optional, List

# Embedded Option Schemas
class OptionBase(BaseModel):
    text: str
    is_correct: bool = False

class OptionCreate(OptionBase):
    pass

class OptionOut(OptionBase):
    id: int
    question_id: int

    class Config:
        from_attributes = True

# Question Schemas
class QuestionBase(BaseModel):
    quiz_id: int
    text: str
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    correct_option: Optional[str] = None

class QuestionCreate(QuestionBase):
    options: Optional[List[OptionCreate]] = None

class QuestionOut(QuestionBase):
    id: int
    options: List[OptionOut] = []

    class Config:
        from_attributes = True