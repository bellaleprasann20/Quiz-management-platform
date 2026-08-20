from sqlalchemy.orm import Session
from app.models.question import Question

def get_questions_by_quiz(db: Session, quiz_id: int):
    """
    Fetches all questions belonging to a specific quiz.
    """
    return db.query(Question).filter(Question.quiz_id == quiz_id).all()