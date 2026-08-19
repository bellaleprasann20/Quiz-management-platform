from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.quiz import Quiz

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

# 1. Define what the React form data should look like
class QuizFormSchema(BaseModel):
    title: str
    description: Optional[str] = ""
    category_id: int
    difficulty: str = "BEGINNER"
    duration: int = 15
    passing_score: int = 70
    status: str = "draft"
    max_attempts: int = 3

@router.get("/")
def get_all_quizzes(
    category_id: Optional[int] = Query(None), 
    search: Optional[str] = Query(None),  
    difficulty: Optional[str] = Query(None), # NEW: Added difficulty parameter
    db: Session = Depends(get_db)
):
    query = db.query(Quiz)
    
    # Filter by category if one is provided
    if category_id:
        query = query.filter(Quiz.category_id == category_id)
        
    # Filter by search term if one is provided
    if search:
        query = query.filter(Quiz.title.ilike(f"%{search}%"))
        
    # NEW: Filter by difficulty if one is provided
    if difficulty:
        query = query.filter(Quiz.difficulty == difficulty)
        
    quizzes = query.all()
    
    # FORMAT THE OUTPUT: Calculate the question count for React
    return [
        {
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description,
            "category_id": quiz.category_id,
            "difficulty": quiz.difficulty,
            "duration": quiz.duration,
            "passing_score": quiz.passing_score,
            "status": quiz.status,
            "max_attempts": quiz.max_attempts,
            "created_at": quiz.created_at,
            "question_count": len(quiz.questions) if quiz.questions else 0
        } for quiz in quizzes
    ]

@router.get("/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

# 2. Endpoint to CREATE a new quiz (Handles the form submission)
@router.post("/")
def create_quiz(quiz_data: QuizFormSchema, db: Session = Depends(get_db)):
    try:
        new_quiz = Quiz(**quiz_data.model_dump()) 
        db.add(new_quiz)
        db.commit()
        db.refresh(new_quiz)
        return {"message": "Quiz created successfully!", "quiz": new_quiz}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# 3. Endpoint to UPDATE an existing quiz (Handles editing a quiz)
@router.put("/{quiz_id}")
def update_quiz(quiz_id: int, quiz_data: QuizFormSchema, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    try:
        # Update the fields
        for key, value in quiz_data.model_dump().items(): 
            setattr(quiz, key, value)
            
        db.commit()
        return {"message": "Quiz updated successfully!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))