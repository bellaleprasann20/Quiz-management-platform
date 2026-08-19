from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.attempt import Attempt
from app.models.option import Option
from app.models.quiz import Quiz  # <-- Added Quiz import

router = APIRouter(prefix="/attempts", tags=["attempts"])

# --- Schemas ---
class StartAttemptRequest(BaseModel):
    quiz_id: int

class AnswerItem(BaseModel):
    question_id: int
    selected_option_id: int

class SubmitAttemptRequest(BaseModel):
    answers: List[AnswerItem]


# --- Endpoints ---
@router.post("/start")
def start_attempt(payload: StartAttemptRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Initializes a new quiz attempt.
    """
    if hasattr(current_user, "interview_ban_until") and current_user.interview_ban_until and current_user.interview_ban_until > datetime.utcnow():
        raise HTTPException(status_code=403, detail="You are currently banned from starting new attempts.")
        
    new_attempt = Attempt(
        user_id=current_user.id,
        quiz_id=payload.quiz_id,
        start_time=datetime.utcnow()
    )
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)
    return new_attempt


@router.post("/{attempt_id}/submit")
def submit_attempt(
    attempt_id: int, 
    payload: SubmitAttemptRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Grades the quiz and saves the final score.
    """
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id, Attempt.user_id == current_user.id).first()
    
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    score = 0
    for answer in payload.answers:
        selected_option = db.query(Option).filter(Option.id == answer.selected_option_id).first()
        if selected_option and selected_option.is_correct:
            score += 1

    attempt.end_time = datetime.utcnow()
    attempt.score = score
    db.commit()
    
    return {"message": "Quiz graded and submitted successfully!", "final_score": score}


@router.get("/history/me")
def get_user_history(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Fetches all past quiz attempts for the logged-in user.
    MUST be placed above /{attempt_id} so FastAPI doesn't confuse "history" with an ID.
    """
    attempts = db.query(Attempt).filter(
        Attempt.user_id == current_user.id
    ).order_by(Attempt.start_time.desc()).all()
    
    # --- THE FIX ---
    # Loop through the attempts and fetch the Quiz Title for each one
    history_data = []
    for attempt in attempts:
        quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
        
        history_data.append({
            "id": attempt.id,
            "user_id": attempt.user_id,
            "quiz_id": attempt.quiz_id,
            "quiz_title": quiz.title if quiz else f"Quiz #{attempt.quiz_id}", # Add the actual title here!
            "score": attempt.score,
            "start_time": attempt.start_time,
            "end_time": attempt.end_time
        })
        
    return history_data


@router.get("/{attempt_id}")
def get_attempt_result(
    attempt_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Fetches the details of a completed attempt for the Results page.
    """
    attempt = db.query(Attempt).filter(
        Attempt.id == attempt_id, 
        Attempt.user_id == current_user.id
    ).first()
    
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
        
    return attempt