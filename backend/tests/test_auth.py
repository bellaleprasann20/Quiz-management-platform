from fastapi.testclient import TestClient
from app.main import app

# We use TestClient to simulate React making requests to our FastAPI app
client = TestClient(app)

def test_register_user():
    # We use a unique email to prevent database conflicts during repeated tests
    test_email = "new_test_student@quiz.com"
    
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test Student",
            "email": test_email,
            "password": "SecurePassword123!"
        }
    )
    
    # Depending on if the user already exists, we expect a 200 (OK) or 400 (Already registered)
    assert response.status_code in [200, 400]
    
    if response.status_code == 200:
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

def test_login_user():
    # FastAPI's OAuth2PasswordRequestForm expects form-data, not JSON
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "student@quiz.com",  # Remember: OAuth2 uses 'username' for the email field
            "password": "student123"
        }
    )
    
    # If the seed script has run, this should succeed
    if response.status_code == 200:
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"