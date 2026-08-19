graph TD
    Client[Browser / React SPA] -->|HTTP / REST API| FastAPI[FastAPI Backend]
    
    subgraph Backend
        FastAPI --> Security[Auth & JWT Middleware]
        Security --> Routes[API Routers]
        Routes --> Services[Business Logic & Timers]
        Services --> Models[SQLAlchemy Models]
    end
    
    Models -->|SQL Queries| DB[(SQLite / PostgreSQL)]