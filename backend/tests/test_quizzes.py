from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_all_categories():
    response = client.get("/api/v1/categories/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_all_quizzes():
    response = client.get("/api/v1/quizzes/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_single_quiz_not_found():
    # Querying a quiz ID that definitely doesn't exist
    response = client.get("/api/v1/quizzes/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Quiz not found"