from sqlalchemy.orm import Session
from app.models.attempt import Attempt
from app.models.question import Question

def calculate_quiz_average(db: Session, quiz_id: int) -> int:
    """
    Calculates the average percentage score for a specific quiz.
    """
    attempts = db.query(Attempt).filter(
        Attempt.quiz_id == quiz_id, 
        Attempt.end_time.isnot(None)
    ).all()
    
    if not attempts:
        return 0
        
    total_questions = db.query(Question).filter(Question.quiz_id == quiz_id).count()
    if total_questions == 0:
        return 0
        
    total_percentage = 0
    for attempt in attempts:
        if attempt.score is not None:
            pct = (attempt.score / total_questions) * 100
            total_percentage += pct
            
    return round(total_percentage / len(attempts))