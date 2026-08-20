from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base

class Answer(Base):
    __tablename__ = "answers"
    
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    
    # What the student actually picked
    selected_option = Column(String, nullable=True)

    # Relationships
    attempt = relationship("Attempt", back_populates="answers")
    question = relationship("Question", back_populates="answers")