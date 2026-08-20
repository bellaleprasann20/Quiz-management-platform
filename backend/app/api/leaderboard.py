from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.user import User
from app.models.attempt import Attempt

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("/global")
def get_global_leaderboard(limit: int = Query(20), db: Session = Depends(get_db)):
    """
    Returns the top students ranked by total correct answers (XP).
    """
    
    # Query to sum up scores (XP) per user
    results = db.query(
        User.username,
        func.sum(Attempt.score).label("total_score")
    ).join(
        Attempt, User.id == Attempt.user_id
    ).filter(
        Attempt.end_time.isnot(None)
    ).group_by(
        User.id, 
        User.username  # <-- Added for strict PostgreSQL compatibility!
    ).order_by(
        func.sum(Attempt.score).desc()
    ).limit(limit).all()

    # Format the results into a list of dictionaries
    leaderboard = [
        {
            "rank": index + 1, 
            "username": row.username, 
            "xp": (row.total_score or 0) * 10
        }
        for index, row in enumerate(results)
    ]
    
    return leaderboard