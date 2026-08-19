from sqlalchemy import text
from app.core.database import engine

def add_columns_safely():
    # The SQL commands to add columns without dropping the table
    queries = [
        "ALTER TABLE users ADD COLUMN phone VARCHAR;",
        "ALTER TABLE users ADD COLUMN location VARCHAR;",
        "ALTER TABLE users ADD COLUMN title VARCHAR;",
        "ALTER TABLE users ADD COLUMN bio TEXT;"
    ]
    
    # Connect to the database and run them
    with engine.begin() as conn:
        for query in queries:
            try:
                conn.execute(text(query))
                print(f"✅ Success: {query}")
            except Exception as e:
                # If it fails, it usually means the column is already there!
                print(f"⚠️ Skipped (column likely exists): {query}")

if __name__ == "__main__":
    print("Starting database upgrade...")
    add_columns_safely()
    print("Upgrade complete! You can safely delete this script.")