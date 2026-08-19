from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from app.models.attempt import Attempt
from app.models.user import User

def start_attempt(db: Session, user: User, quiz_id: int) -> Attempt:
    if user.interview_ban_until and user.interview_ban_until > datetime.utcnow():
        raise HTTPException(status_code=403, detail="You are currently banned from starting new attempts.")
        
    attempt = Attempt(
        user_id=user.id,
        quiz_id=quiz_id,
        start_time=datetime.utcnow()
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt

def submit_attempt(db: Session, attempt_id: int, user_id: int, score: int) -> Attempt:
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id, Attempt.user_id == user_id).first()
    
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.end_time:
        raise HTTPException(status_code=400, detail="This attempt has already been submitted.")
        
    attempt.end_time = datetime.utcnow()
    attempt.score = score
    
    # Example timer validation could go here
    # time_taken = (attempt.end_time - attempt.start_time).total_seconds()
    
    db.commit()
    db.refresh(attempt)
    return attempt