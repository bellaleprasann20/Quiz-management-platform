from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.attempt import Attempt
from app.models.question import Question  
from app.models.quiz import Quiz  
from app.models.category import Category  # <-- We need to import Category!

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/admin")
def get_admin_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)): 
    total_users = db.query(User).count()
    total_quizzes = db.query(Quiz).count()
    completed_attempts = db.query(Attempt).filter(Attempt.end_time.isnot(None)).order_by(Attempt.end_time.desc()).all()
    total_attempts = len(completed_attempts)
    
    global_percentage = 0
    quiz_stats = {} 
    
    for attempt in completed_attempts:
        total_questions = db.query(Question).filter(Question.quiz_id == attempt.quiz_id).count()
        if attempt.score is not None and total_questions > 0:
            pct = (attempt.score / total_questions) * 100
            global_percentage += pct
            
            if attempt.quiz_id not in quiz_stats:
                quiz_stats[attempt.quiz_id] = {"total_score": 0, "count": 0}
            quiz_stats[attempt.quiz_id]["total_score"] += pct
            quiz_stats[attempt.quiz_id]["count"] += 1
            
    average_score = round(global_percentage / total_attempts) if total_attempts > 0 else 0
    
    top_quizzes = []
    for q_id, stats in quiz_stats.items():
        avg = stats["total_score"] / stats["count"]
        quiz = db.query(Quiz).filter(Quiz.id == q_id).first()
        top_quizzes.append({
            "title": quiz.title if quiz else f"Quiz {q_id}",
            "average": round(avg)
        })
    top_quizzes = sorted(top_quizzes, key=lambda x: x["average"], reverse=True)[:3]
    
    recent_activity = []
    for a in completed_attempts[:5]: 
        user = db.query(User).filter(User.id == a.user_id).first()
        quiz = db.query(Quiz).filter(Quiz.id == a.quiz_id).first()
        total_q = db.query(Question).filter(Question.quiz_id == a.quiz_id).count()
        score_pct = round((a.score / total_q) * 100) if a.score is not None and total_q > 0 else 0
        recent_activity.append({
            "student_name": getattr(user, "username", "Unknown Student"),
            "quiz_title": quiz.title if quiz else f"Quiz {a.quiz_id}",
            "score": score_pct,
            "date": a.end_time.strftime("%b %d, %Y") if a.end_time else "Unknown"
        })
        
    return {
        "total_users": total_users,
        "total_quizzes": total_quizzes,
        "total_attempts": total_attempts,
        "average_score": average_score,
        "recent_activity": recent_activity,
        "top_quizzes": top_quizzes, 
        "chart_data": [40, 70, 45, 90, 65, 85, 100] 
    }

@router.get("/student/me")
def get_student_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    attempts = db.query(Attempt).filter(
        Attempt.user_id == current_user.id,
        Attempt.end_time.isnot(None)
    ).all()
    
    if not attempts:
        return {
            "total_score": 0, "quizzes_passed": 0, "total_attempts": 0,
            "time_spent_minutes": 0, "average_score": 0, "total_quizzes_taken": 0,
            "total_xp": 0, "rank": None, "proficiencies": []
        }
        
    total_score = 0
    quizzes_passed = 0
    total_attempts = len(attempts)
    time_spent_seconds = 0
    total_percentage = 0
    proficiencies_dict = {}
    
    for attempt in attempts:
        if attempt.score:
            total_score += attempt.score
            
        total_questions = db.query(Question).filter(Question.quiz_id == attempt.quiz_id).count()
            
        if attempt.score is not None and total_questions > 0:
            percentage = (attempt.score / total_questions) * 100
            total_percentage += percentage
            
            if percentage >= 60:
                quizzes_passed += 1
                
            # --- THE FIX IS HERE ---
            # 1. Get the Quiz
            quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
            
            # 2. Get the Category that the Quiz belongs to
            if quiz and quiz.category_id:
                category = db.query(Category).filter(Category.id == quiz.category_id).first()
                subject = category.name if category else "Uncategorized"
            else:
                subject = "Uncategorized"
            # ------------------------
            
            # Keep the highest score the user has achieved in this specific Category
            if subject not in proficiencies_dict or percentage > proficiencies_dict[subject]:
                proficiencies_dict[subject] = round(percentage)
                
        if attempt.start_time and attempt.end_time:
            time_diff = attempt.end_time - attempt.start_time
            time_spent_seconds += time_diff.total_seconds()
            
    time_spent_minutes = round(time_spent_seconds / 60)
    average_score = round(total_percentage / total_attempts) if total_attempts > 0 else 0
    total_xp = total_score * 10 
    
    proficiencies_list = [{"subj": subj, "score": score} for subj, score in proficiencies_dict.items()]
    
    return {
        "total_score": total_score,
        "quizzes_passed": quizzes_passed,
        "total_attempts": total_attempts,
        "time_spent_minutes": time_spent_minutes,
        "average_score": average_score,
        "total_quizzes_taken": total_attempts, 
        "total_xp": total_xp,
        "rank": None, 
        "proficiencies": proficiencies_list
    }