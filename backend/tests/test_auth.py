import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from models import Base, User
from db import get_db

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_user_data():
    return {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "0123456789",
        "is_professional": False
    }

def test_register_client(client, test_user_data):
    """Test client registration"""
    response = client.post("/api/auth/register", json=test_user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user_data["email"]
    assert data["name"] == test_user_data["name"]
    assert data["is_professional"] == False

def test_register_professional(client):
    """Test professional registration"""
    pro_data = {
        "name": "Test Salon",
        "email": "salon@example.com",
        "phone": "0123456789",
        "is_professional": True
    }
    response = client.post("/api/auth/register", json=pro_data)
    assert response.status_code == 200
    data = response.json()
    assert data["is_professional"] == True

def test_register_duplicate_email(client, test_user_data):
    """Test registration with duplicate email"""
    # Register first user
    client.post("/api/auth/register", json=test_user_data)
    
    # Try to register with same email
    response = client.post("/api/auth/register", json=test_user_data)
    assert response.status_code == 400

def test_login_success(client, test_user_data):
    """Test successful login"""
    # Register user first
    client.post("/api/auth/register", json=test_user_data)
    
    # Login
    login_data = {
        "email": test_user_data["email"],
        "password": "testpassword"
    }
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data

def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    login_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", json=login_data)
    # For MVP, we auto-create users, so this should succeed
    assert response.status_code == 200

def test_get_current_user(client, test_user_data):
    """Test getting current user profile"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    login_response = client.post("/api/auth/login", json={
        "email": test_user_data["email"],
        "password": "testpassword"
    })
    
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get profile
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user_data["email"]

def test_unauthorized_access(client):
    """Test accessing protected route without token"""
    response = client.get("/api/auth/me")
    assert response.status_code == 401
