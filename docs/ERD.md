erDiagram
    USERS {
        int id PK
        string username
        string email
        string hashed_password
        string role
    }
    CATEGORIES {
        int id PK
        string name
    }
    QUIZZES {
        int id PK
        string title
        int time_limit_minutes
        int category_id FK
    }
    QUESTIONS {
        int id PK
        string text
        int quiz_id FK
    }
    OPTIONS {
        int id PK
        string text
        boolean is_correct
        int question_id FK
    }
    ATTEMPTS {
        int id PK
        datetime start_time
        datetime end_time
        float score
        int user_id FK
        int quiz_id FK
    }
    ANSWERS {
        int id PK
        boolean is_correct
        int attempt_id FK
        int question_id FK
        int selected_option_id FK
    }

    CATEGORIES ||--o{ QUIZZES : contains
    QUIZZES ||--o{ QUESTIONS : has
    QUESTIONS ||--o{ OPTIONS : has
    USERS ||--o{ ATTEMPTS : makes
    QUIZZES ||--o{ ATTEMPTS : receives
    ATTEMPTS ||--o{ ANSWERS : records
    QUESTIONS ||--o{ ANSWERS : answered_in