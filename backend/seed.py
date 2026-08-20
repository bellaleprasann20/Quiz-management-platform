import os
from sqlalchemy import text
from app.core.database import SessionLocal, engine, Base

# Forces Python to read your models and know what tables to create
import app.models 

def run_seed():
    print("🏗️ Building database tables...")
    # This creates the empty tables (categories, quizzes, users, etc.)
    Base.metadata.create_all(bind=engine)
    
    print("🌱 Reading from database/seed.sql...")
    db = SessionLocal()
    
    sql_file_path = os.path.abspath(os.path.join(os.getcwd(), "..", "database", "seed.sql"))
    
    if not os.path.exists(sql_file_path):
        print(f"⚠️ Error: Could not find {sql_file_path}")
        return

    try:
        with open(sql_file_path, "r", encoding="utf-8") as file:
            # Split the file by semicolon to execute each INSERT command individually
            sql_commands = file.read().split(';')
            for command in sql_commands:
                if command.strip():
                    db.execute(text(command))
            
            db.commit()
            
        print("✅ All categories and quizzes have been seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()