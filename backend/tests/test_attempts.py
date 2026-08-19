from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_start_attempt_unauthorized():
    # Trying to start quiz #1 without a bearer token
    response = client.post("/api/v1/attempts/start/1")
    
    # Should be blocked by our get_current_user dependency
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_submit_attempt_unauthorized():
    # Trying to submit a score without a bearer token
    response = client.post("/api/v1/attempts/1/submit?score=80")
    
    assert response.status_code == 401