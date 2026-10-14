import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.main import app
from backend.app.database.session import Base, get_db
import backend.app.database.models  # Ensure models are registered on Base.metadata

TEST_DB_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    return TestClient(app)

def test_health_endpoint(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["models_loaded"] is True
    assert "CAD" in data["active_models"]
    assert "LAD" in data["active_models"]
    assert "LCX" in data["active_models"]
    assert "RCA" in data["active_models"]

def test_model_info_and_metrics(client):
    info_res = client.get("/api/v1/model-info")
    assert info_res.status_code == 200
    info_data = info_res.json()
    assert info_data["targets"] == ["CAD", "LAD", "LCX", "RCA"]
    assert info_data["features_count"] > 30

    metrics_res = client.get("/api/v1/metrics")
    assert metrics_res.status_code == 200
    metrics_data = metrics_res.json()
    assert "CAD" in metrics_data
    assert "accuracy" in metrics_data["CAD"]["metrics"]

def test_prediction_endpoint(client):
    sample_patient = {
        "Age": 62,
        "Sex": "Male",
        "BP": 145,
        "DM": 1,
        "HTN": 1,
        "Current Smoker": 1,
        "LDL": 165,
        "HDL": 35,
        "St Depression": 1.5,
        "Typical Chest Pain": 1,
    }
    res = client.post("/api/v1/predict", json={"patient_data": sample_patient})
    assert res.status_code == 200
    data = res.json()
    assert "targets" in data
    assert "CAD" in data["targets"]
    assert 0.0 <= data["targets"]["CAD"]["probability"] <= 1.0

def test_explain_endpoint(client):
    sample_patient = {
        "Age": 68,
        "Sex": "Male",
        "BP": 160,
        "DM": 1,
        "LDL": 180,
    }
    res = client.post("/api/v1/explain", json={"target": "CAD", "patient_data": sample_patient})
    assert res.status_code == 200
    data = res.json()
    assert data["target"] == "CAD"
    assert "contributions" in data
    assert len(data["contributions"]) > 0

def test_auth_workflow_and_cross_account_isolation(client):
    # 1. Register User 1
    u1_reg = client.post("/api/v1/auth/register", json={
        "full_name": "Dr. Alice Smith",
        "email": "alice@hospital.org",
        "password": "Password123!"
    })
    assert u1_reg.status_code == 201
    u1_token = u1_reg.json()["access_token"]
    u1_headers = {"Authorization": f"Bearer {u1_token}"}

    # 2. Register Duplicate Email (should fail 400)
    u1_dup = client.post("/api/v1/auth/register", json={
        "full_name": "Alice Duplicate",
        "email": "alice@hospital.org",
        "password": "Password123!"
    })
    assert u1_dup.status_code == 400

    # 3. Register User 2
    u2_reg = client.post("/api/v1/auth/register", json={
        "full_name": "Dr. Bob Jones",
        "email": "bob@clinic.org",
        "password": "Password456!"
    })
    assert u2_reg.status_code == 201
    u2_token = u2_reg.json()["access_token"]
    u2_headers = {"Authorization": f"Bearer {u2_token}"}

    # 4. User 1 Login
    u1_login = client.post("/api/v1/auth/login", json={
        "email": "alice@hospital.org",
        "password": "Password123!"
    })
    assert u1_login.status_code == 200

    # 5. User 1 Invalid Password Login (should fail 401)
    bad_login = client.post("/api/v1/auth/login", json={
        "email": "alice@hospital.org",
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 6. User 1 creates an assessment
    asm_res = client.post("/api/v1/assessments", headers=u1_headers, json={
        "patient_alias": "Patient 101 - Alice",
        "input_data": {"Age": 60, "Sex": "Female", "BP": 140, "LDL": 150}
    })
    assert asm_res.status_code == 201
    u1_asm_id = asm_res.json()["id"]

    # 7. User 1 can view their own report
    view_u1 = client.get(f"/api/v1/assessments/{u1_asm_id}", headers=u1_headers)
    assert view_u1.status_code == 200
    assert view_u1.json()["patient_alias"] == "Patient 101 - Alice"

    # 8. User 2 attempts to access User 1's report (MUST BE 403 FORBIDDEN!)
    view_u2 = client.get(f"/api/v1/assessments/{u1_asm_id}", headers=u2_headers)
    assert view_u2.status_code == 403
    assert "forbidden" in view_u2.json()["detail"].lower()

    # 9. User 2 lists assessments (should be empty for User 2)
    u2_list = client.get("/api/v1/assessments", headers=u2_headers)
    assert u2_list.status_code == 200
    assert len(u2_list.json()) == 0

    # 10. User 1 lists assessments (should contain 1 assessment)
    u1_list = client.get("/api/v1/assessments", headers=u1_headers)
    assert u1_list.status_code == 200
    assert len(u1_list.json()) == 1

    # 11. User 2 attempts to delete User 1's report (MUST BE 403 FORBIDDEN!)
    del_u2 = client.delete(f"/api/v1/assessments/{u1_asm_id}", headers=u2_headers)
    assert del_u2.status_code == 403

    # 12. User 1 deletes their own report
    del_u1 = client.delete(f"/api/v1/assessments/{u1_asm_id}", headers=u1_headers)
    assert del_u1.status_code == 200
