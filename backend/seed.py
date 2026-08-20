import os
from sqlalchemy import text
from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password

import app.models 
from app.models.user import User, UserRole

def run_seed():
    print("🗑️ Wiping old database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("👑 Creating Master Admin...")
        admin = User(
            username="Admin", email="admin@quiz.com",
            hashed_password=hash_password("admin123"),
            role=UserRole.ADMIN, is_active=True
        )
        db.add(admin)
        db.commit()

        # Look for seed.sql right next to this file in the backend folder
        current_dir = os.path.dirname(os.path.abspath(__file__))
        sql_file_path = os.path.join(current_dir, "seed.sql")
        
        print(f"🌱 Reading from {sql_file_path}...")
        
        if not os.path.exists(sql_file_path):
            print(f"⚠️ ERROR: Could not find seed.sql at {sql_file_path}. Did you move it to the backend folder?")
            return

        with open(sql_file_path, "r", encoding="utf-8") as file:
            sql_content = file.read()
            
        for command in sql_content.split(';'):
            clean_command = command.strip()
            if clean_command:
                db.execute(text(clean_command))
            
        db.commit()
        print("✅ Success: Admin created and ALL data seeded!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()