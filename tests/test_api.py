import io
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_get_roles(client):
    response = client.get("/api/roles")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert len(data["roles"]) >= 10

def test_analyze_no_file(client):
    response = client.post("/analyze", data={})
    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False

def test_analyze_valid_txt(client):
    content = b"""
    John Doe
    john@example.com | 555-0199 | linkedin.com/in/johndoe
    
    Summary
    Frontend developer with expertise in React, JavaScript, CSS, HTML, and Git.
    
    Education
    BS Computer Science
    
    Skills
    React, JavaScript, HTML, CSS, Git, TypeScript, Responsive Design
    
    Projects
    Built responsive e-commerce web application with React and Vite.
    """
    data = {
        "resume": (io.BytesIO(content), "resume.txt"),
        "role": "frontend developer",
        "user_type": "fresher"
    }
    response = client.post("/analyze", data=data, content_type="multipart/form-data")
    assert response.status_code == 200
    res = response.get_json()
    assert res["success"] is True
    assert res["score"] > 50
    assert "skills_breakdown" in res
    assert "category_scores" in res
    assert res["metadata"]["file_type"] == "txt"

def test_ai_critique_endpoint(client):
    payload = {
        "resume_text": "Experienced in React and JavaScript. Built several websites.",
        "role": "frontend developer",
        "user_type": "fresher"
    }
    response = client.post("/api/ai/critique", json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert "critique" in data
    assert "bullet_rewrites" in data["critique"]
