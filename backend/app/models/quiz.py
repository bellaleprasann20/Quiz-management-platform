from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    # === NEW: Link the quiz to a User! ===
    creator_id = Column(Integer, ForeignKey("users.id"))
    
    difficulty = Column(String, default="BEGINNER")
    duration = Column(Integer, default=15)
    passing_score = Column(Integer, default=70)
    status = Column(String, default="published")
    max_attempts = Column(Integer, default=3)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    category = relationship("Category", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="quiz", cascade="all, delete-orphan")
    # === NEW: Tell SQLAlchemy about the User relationship ===
    creator = relationship("User", back_populates="quizzes")