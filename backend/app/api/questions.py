import csv
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.question import Question
from app.models.option import Option

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("/quiz/{quiz_id}")
def get_quiz_questions(quiz_id: int, db: Session = Depends(get_db)):
    """
    Fetches all questions for a quiz AND manually attaches their options 
    so the React frontend can display them.
    """
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this quiz")
    
    full_data = []
    for q in questions:
        options = db.query(Option).filter(Option.question_id == q.id).all()
        
        full_data.append({
            "id": q.id,
            "quiz_id": q.quiz_id,
            "text": q.text,
            "question": q.text,
            "options": [
                {
                    "id": opt.id,
                    "text": opt.text,
                    "is_correct": opt.is_correct
                } for opt in options
            ]
        })
        
    return full_data


@router.get("/quiz/{quiz_id}/take")
def take_quiz_questions(quiz_id: int, db: Session = Depends(get_db)):
    """
    Dedicated endpoint for students taking a quiz, matching the /take path 
    requested by AttemptQuiz.jsx.
    """
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this quiz")
    
    full_data = []
    for q in questions:
        options = db.query(Option).filter(Option.question_id == q.id).all()
        
        full_data.append({
            "id": q.id,
            "quiz_id": q.quiz_id,
            "text": q.text,
            "question": q.text,
            "options": [
                {
                    "id": opt.id,
                    "text": opt.text,
                    "is_correct": opt.is_correct
                } for opt in options
            ]
        })
        
    return full_data


@router.post("/bulk-upload/{quiz_id}")
async def bulk_upload_questions(
    quiz_id: int,
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    """
    Accepts a CSV file upload from React, parses the rows, 
    and saves questions and options to the database.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    try:
        contents = await file.read()
        decoded_content = contents.decode('utf-8')
        
        csv_reader = csv.DictReader(io.StringIO(decoded_content))
        created_count = 0

        for row in csv_reader:
            question_text = row.get("Question Text")
            if not question_text:
                continue

            new_question = Question(quiz_id=quiz_id, text=question_text)
            db.add(new_question)
            db.flush() # Flushes to generate the question ID without committing the transaction

            try:
                correct_option_index = int(row.get("Correct Option (1-4)", 1))
            except ValueError:
                correct_option_index = 1

            for i in range(1, 5):
                option_text = row.get(f"Option {i}")
                
                if option_text:
                    is_correct = (i == correct_option_index)
                    new_option = Option(
                        question_id=new_question.id,
                        text=option_text,
                        is_correct=is_correct
                    )
                    db.add(new_option)

            created_count += 1

        db.commit()
        return {"message": f"Successfully processed {created_count} questions from {file.filename}!"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to process CSV: {str(e)}")


@router.put("/{question_id}/correct-option/{option_id}")
def update_correct_option(question_id: int, option_id: int, db: Session = Depends(get_db)):
    """
    Updates a question to mark a specific option as the correct one,
    and automatically sets all other options for that question to false.
    """
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    options = db.query(Option).filter(Option.question_id == question_id).all()
    
    option_found = False
    for opt in options:
        if opt.id == option_id:
            opt.is_correct = True
            option_found = True
        else:
            opt.is_correct = False
            
    if not option_found:
        raise HTTPException(status_code=404, detail="Option not found")
        
    db.commit()
    return {"message": "Correct answer updated successfully!"}


@router.delete("/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    """
    Deletes a specific question by ID. 
    SQLAlchemy will also automatically delete the associated options 
    if cascade="all, delete-orphan" is set on the relationship.
    """
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    try:
        db.delete(question)
        db.commit()
        return {"message": "Question deleted successfully!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))