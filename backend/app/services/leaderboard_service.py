from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.user import User
from app.models.attempt import Attempt

def get_top_users(db: Session, limit: int = 10):
    """
    Calculates the total XP for all users and returns the top players.
    """
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

    leaderboard = []
    for index, row in enumerate(results):
        leaderboard.append({
            "rank": index + 1,
            "username": row.username,
            # 1 correct answer = 10 XP
            "xp": (row.total_score or 0) * 10 
        })
        
    return leaderboard