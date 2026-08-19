# By importing all models here, Python ensures SQLAlchemy "sees" 
# every single table relationship the moment the app starts.

from app.models.user import User, UserRole
from app.models.category import Category
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.option import Option
from app.models.attempt import Attempt
from app.models.answer import Answer