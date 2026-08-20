from typing import Optional
from sqlalchemy.orm import Session
from app.models.quiz import Quiz

def get_all_quizzes(db: Session, category_id: Optional[int] = None):
    """
    Fetches all quizzes, optionally filtered by category.
    """
    query = db.query(Quiz)
    if category_id:
        query = query.filter(Quiz.category_id == category_id)
    return query.all()


def get_quiz_by_id(db: Session, quiz_id: int):
    """
    Fetches a single quiz by its unique ID.
    """
    return db.query(Quiz).filter(Quiz.id == quiz_id).first()