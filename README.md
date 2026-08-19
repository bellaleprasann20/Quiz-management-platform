# Quiz Management & Online Assessment Platform

A full-stack web application for creating, publishing, and taking online
quizzes. Admins manage categories, quizzes, and questions; students browse,
attempt timed quizzes, and track their results and leaderboard ranking.

**Stack:** React (Vite) + Tailwind CSS on the frontend, Python (FastAPI) +
SQLAlchemy + SQLite on the backend.

---

## Project structure

```
quiz-management-platform/
├── backend/          # FastAPI backend (see backend/app/)
├── frontend/          # React + Vite frontend (see frontend/src/)
├── rebuild_backend.ps1  # Rebuilds backend/app/ from a known-good file set
└── README.md
```

---

## Backend setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file in `backend/` (see `.env.example` if present):

```
DATABASE_URL=sqlite:///./quiz_platform.db
SECRET_KEY=<a long random string>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_ORIGIN=http://localhost:5173
```

**⚠️ Known dependency pitfall:** `passlib` breaks with `bcrypt` 4.1+
(`password cannot be longer than 72 bytes` on every password, even short
ones). If you hit this, pin the correct version:

```powershell
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

### Populate the database

```powershell
python seed.py
```

Creates a working admin account (`admin@quizmaster.com` / `admin123`), a
sample category, a published quiz, and two sample questions. Safe to
re-run — it won't duplicate existing data.

### Run the server

```powershell
python -m uvicorn app.main:app --reload
```

Visit `http://127.0.0.1:8000/docs` for interactive API documentation
(Swagger UI). Health check: `http://127.0.0.1:8000/`.

### Useful scripts

| Script | Purpose |
|---|---|
| `seed.py` | Creates admin + sample category/quiz/questions. Idempotent. |
| `backup_db.py` | Copies `quiz_platform.db` to `db_backups/` with a timestamp. **Run this before `reset.py` or any schema change.** Keeps the last 10 backups automatically. |
| `reset.py` | Drops and recreates all tables. **Destructive** — wipes all data. Only use during development, and only after running `backup_db.py`. |
| `check_db.py` | Lists every table and its row count — quick sanity check after any reset or migration. |

If the backend ever ends up in an inconsistent state (import errors between
files), `rebuild_backend.ps1` at the project root rewrites the entire
`backend/app/` folder from a known-good, tested file set in one atomic run.

---

## Frontend setup

```powershell
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_URL=http://127.0.0.1:8000
```

### Run the dev server

```powershell
npm run dev
```

Visit `http://localhost:5173`.

---

## Features implemented

**Auth & roles**
- Registration, login (JWT), role-based access (Admin / Student)
- Backend-enforced authorization on every protected route

**Admin**
- Dashboard with live platform analytics
- Category management
- Quiz create/edit/delete/publish

**Student**
- Browse/search/filter published quizzes
- Timed quiz attempts with question navigation, auto-submit on expiry
- Full answer review after submission
- Attempt history
- Leaderboard

**Security notes worth knowing**
- Scoring and timer validation happen server-side only — the frontend
  countdown is cosmetic; the backend independently checks elapsed time on
  submit, so a manipulated browser clock can't grant extra time.
- Correct answers are never sent to the client before a quiz attempt has
  actually started. The `GET /api/quizzes/{id}` endpoint returns a
  stripped, answer-free response to students and only the full detail
  (with correct answers) to admins.

---

## Question bank CSVs

`Question Text,Option 1,Option 2,Option 3,Option 4,Correct Option (1-4)`

A set of ready-made 20-question CSVs covering 47 languages/technologies
(Python, JavaScript, TypeScript, Java, C++, C#, Ruby, Go, Rust, Swift,
Kotlin, PHP, HTML/CSS, SQL, Bash, R, MATLAB, Perl, Objective-C, Scala,
Dart, Lua, Haskell, Elixir, Clojure, F#, Erlang, COBOL, Fortran, Lisp,
Prolog, Pascal, Assembly, Visual Basic, Delphi, Ada, ABAP, Groovy, Julia,
VHDL, Verilog, Solidity, GraphQL, Apex, VBA, PowerShell, Awk, Tcl, Scheme,
WebAssembly, and Scratch) exists but currently has **no import endpoint**
to load them through — see Known Gaps below.

---

## Known gaps / not yet built

- **CSV bulk question import** — no `POST /api/quizzes/{id}/questions/import`
  endpoint exists yet. Question bank CSVs must currently be entered one by
  one through the admin "add question" flow.
- Admin quiz/question/category/user management **screens** (the backend
  routes exist and are tested; the frontend pages are not yet built).
- Student Profile page.
- Alembic migrations are scaffolded but not the primary schema-change
  workflow yet — `reset.py` (destructive) is currently used instead during
  development.

---

## Troubleshooting

If you hit an `ImportError: cannot import name 'X' from 'Y'` on backend
startup, it almost always means a file in `backend/app/` is stale/mismatched
against the rest of the codebase. Fastest fix: run `rebuild_backend.ps1`
from the project root to restore the entire `app/` folder from the known-
good set in one pass, rather than patching files individually.