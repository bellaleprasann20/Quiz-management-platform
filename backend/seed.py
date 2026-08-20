import os
from sqlalchemy import text
from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password

# Import models
import app.models 
from app.models.user import User, UserRole

def run_seed():
    print("🗑️ Wiping old database and creating fresh tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("👑 Creating Master Admin account...")
        admin = User(
            username="Admin",
            email="admin@quiz.com",
            hashed_password=hash_password("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("✅ Admin account created (admin@quiz.com / admin123)")

        print("🌱 Reading from database/seed.sql...")
        current_dir = os.path.dirname(os.path.abspath(__file__))
        sql_file_path = os.path.abspath(os.path.join(current_dir, "..", "..", "database", "seed.sql"))
        
        if not os.path.exists(sql_file_path):
            sql_file_path = os.path.abspath(os.path.join(os.getcwd(), "..", "database", "seed.sql"))
        
        if not os.path.exists(sql_file_path):
            print(f"⚠️ Error: Could not find seed file at {sql_file_path}")
            return

        with open(sql_file_path, "r", encoding="utf-8") as file:
            sql_content = file.read()
            
        sql_commands = sql_content.split(';')
        for command in sql_commands:
            clean_command = command.strip()
            if clean_command:
                db.execute(text(clean_command))
            
        db.commit()
        print("✅ Database wiped, admin created, and all 50+ quizzes seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()