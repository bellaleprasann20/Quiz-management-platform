# API Documentation

Base URL: `/api/v1`

## Authentication (`/auth`)
*   `POST /auth/register` - Register a new Admin or Student.
    *   **Body:** `{ "username": "str", "email": "str", "password": "str", "role": "student|admin" }`
*   `POST /auth/login` - Authenticate and receive a JWT.
    *   **Body (Form-Data):** `username={email}&password={password}`

## Quizzes (`/quizzes`)
*   `GET /quizzes/` - Get a list of all available quizzes.
*   `GET /quizzes/{id}` - Get details of a specific quiz.
*   `POST /quizzes/` - (Admin only) Create a new quiz.

## Attempts & Assessments (`/attempts`)
*   `POST /attempts/start/{quiz_id}` - Start a countdown timer and initialize an attempt.
*   `POST /attempts/submit/{attempt_id}` - Submit answers for automatic scoring.
    *   **Body:** `{ "answers": [ {"question_id": 1, "selected_option_id": 2} ] }`

## Leaderboard (`/leaderboard`)
*   `GET /leaderboard/` - Get the global top-performing students.
*   `GET /leaderboard/quiz/{quiz_id}` - Get the top performers for a specific quiz.