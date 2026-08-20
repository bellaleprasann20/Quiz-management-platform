import os
from sqlalchemy import text
from app.core.database import SessionLocal, engine, Base

# Forces Python to read your models and know what tables to create
import app.models 

def run_seed():
    print("🗑️ Wiping old database and creating fresh tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    print("🌱 Reading from database/seed.sql...")
    db = SessionLocal()
    
    # Robust path resolution relative to this file's location
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sql_file_path = os.path.abspath(os.path.join(current_dir, "..", "..", "database", "seed.sql"))
    
    if not os.path.exists(sql_file_path):
        sql_file_path = os.path.abspath(os.path.join(os.getcwd(), "..", "database", "seed.sql"))
    
    if not os.path.exists(sql_file_path):
        print(f"⚠️ Error: Could not find seed file at {sql_file_path}")
        db.close()
        return

    try:
        with open(sql_file_path, "r", encoding="utf-8") as file:
            sql_content = file.read()
            
        # Split the file by semicolon to execute each command individually
        sql_commands = sql_content.split(';')
        for command in sql_commands:
            clean_command = command.strip()
            if clean_command:
                db.execute(text(clean_command))
            
        db.commit()
        print("✅ Database wiped, categories created, and all 50+ quizzes seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()