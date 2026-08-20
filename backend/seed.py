import os
from sqlalchemy import text
from app.core.database import SessionLocal, engine, Base

# Forces Python to read your models and know what tables to create
import app.models 

def run_seed():
    print("🏗️ Building database tables...")
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
                try:
                    db.execute(text(clean_command))
                    db.commit()
                except Exception as cmd_error:
                    # If it's a unique constraint violation, roll back just this statement and continue
                    db.rollback()
                    if "UNIQUE constraint failed" in str(cmd_error) or "duplicate key" in str(cmd_error):
                        print(f"ℹ️ Skipping duplicate entry (already seeded).")
                    else:
                        print(f"⚠️ Notice on command execution: {cmd_error}")
            
        print("✅ Seeding process completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()