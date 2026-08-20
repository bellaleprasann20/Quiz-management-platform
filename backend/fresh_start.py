import os
from sqlalchemy import text
from app.core.database import engine, Base, SessionLocal
from app.core.security import hash_password

# 🚨 IMPORT ALL MODELS HERE! 
from app.models.user import User, UserRole
from app.models.quiz import Quiz
from app.models.category import Category
from app.models.question import Question
from app.models.option import Option
from app.models.attempt import Attempt
from app.models.answer import Answer

def rebuild_everything():
    print("🗑️ 1. Wiping old database and creating fresh tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("👑 2. Creating Master Admin account...")
        admin = User(
            username="Admin",
            email="admin@quiz.com",
            hashed_password=hash_password("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin)
        db.commit()
        
        print("📂 3. Loading Categories and Quizzes from database/seed.sql...")
        
        # Robust path resolution relative to this file's location
        current_dir = os.path.dirname(os.path.abspath(__file__))
        sql_file_path = os.path.abspath(os.path.join(current_dir, "..", "..", "database", "seed.sql"))
        
        # Fallback to previous behavior if nested differently
        if not os.path.exists(sql_file_path):
            sql_file_path = os.path.abspath(os.path.join(os.getcwd(), "..", "database", "seed.sql"))
        
        if os.path.exists(sql_file_path):
            with open(sql_file_path, "r", encoding="utf-8") as file:
                # Split by semicolon to execute SQL commands one by one
                sql_commands = file.read().split(';')
                for command in sql_commands:
                    if command.strip():
                        db.execute(text(command))
                db.commit()
            print("✅ SQL file loaded successfully!")
        else:
            print(f"⚠️ Could not find seed file at {sql_file_path}, skipping SQL injection.")
            
        print("\n🎉 FRESH START COMPLETE! Admin account ready.")
        print("👉 Students can now create their own accounts using the Register endpoint.")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    rebuild_everything()