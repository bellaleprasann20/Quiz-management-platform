from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_global_leaderboard():
    response = client.get("/api/v1/leaderboard/")
    
    assert response.status_code == 200
    data = response.json()
    
    # Must return a list
    assert isinstance(data, list)
    
    # If there's data, check the structure
    if len(data) > 0:
        entry = data[0]
        assert "rank" in entry
        assert "username" in entry
        assert "xp" in entry