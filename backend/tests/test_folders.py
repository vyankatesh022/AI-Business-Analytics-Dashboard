import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import os
import json
from backend.main import app
from backend.auth.dependencies import get_current_user
from backend.services.dataset_service import LOCAL_FOLDERS_PATH, LOCAL_DB_PATH

client = TestClient(app)

async def mock_get_current_user():
    return {"id": "test-user-id", "email": "test@example.com", "role": "Pro"}

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = mock_get_current_user
    yield
    app.dependency_overrides.clear()

@pytest.fixture(autouse=True)
def clean_mock_files():
    # Setup: clean files before test
    if os.path.exists(LOCAL_FOLDERS_PATH):
        try:
            os.remove(LOCAL_FOLDERS_PATH)
        except Exception:
            pass
    if os.path.exists(LOCAL_DB_PATH):
        try:
            os.remove(LOCAL_DB_PATH)
        except Exception:
            pass
            
    yield
    
    # Teardown: clean files after test
    if os.path.exists(LOCAL_FOLDERS_PATH):
        try:
            os.remove(LOCAL_FOLDERS_PATH)
        except Exception:
            pass
    if os.path.exists(LOCAL_DB_PATH):
        try:
            os.remove(LOCAL_DB_PATH)
        except Exception:
            pass

def test_folders_workflow():
    # 1. List folders (should be empty initially)
    response = client.get("/api/datasets/folders")
    assert response.status_code == 200
    assert response.json()["folders"] == []

    # 2. Create a folder
    response = client.post(
        "/api/datasets/folders",
        json={"name": "Sales Data", "parent_id": None}
    )
    assert response.status_code == 200
    folder = response.json()
    assert folder["name"] == "Sales Data"
    assert folder["parent_id"] is None
    assert "id" in folder
    folder_id = folder["id"]

    # 3. Create a subfolder
    response = client.post(
        "/api/datasets/folders",
        json={"name": "Q2", "parent_id": folder_id}
    )
    assert response.status_code == 200
    subfolder = response.json()
    assert subfolder["name"] == "Q2"
    assert subfolder["parent_id"] == folder_id

    # 4. List folders (should have 2 folders)
    response = client.get("/api/datasets/folders")
    assert response.status_code == 200
    assert len(response.json()["folders"]) == 2

    # 5. Rename folder
    response = client.patch(
        f"/api/datasets/folders/{folder_id}",
        json={"name": "Corporate Sales"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Corporate Sales"

    # 6. Delete folder
    response = client.delete(f"/api/datasets/folders/{folder_id}")
    assert response.status_code == 200
    
    # 7. List folders again (Corporate Sales deleted, subfolder moved to root/None parent)
    response = client.get("/api/datasets/folders")
    assert response.status_code == 200
    folders_list = response.json()["folders"]
    assert len(folders_list) == 1
    assert folders_list[0]["name"] == "Q2"
    assert folders_list[0]["parent_id"] is None

def test_move_dataset():
    # 1. Create a folder
    response = client.post(
        "/api/datasets/folders",
        json={"name": "Finance", "parent_id": None}
    )
    assert response.status_code == 200
    folder_id = response.json()["id"]

    # 2. Write a mock dataset directly to local DB file
    mock_dataset = {
        "id": "ds-test-999",
        "user_id": "test-user-id",
        "filename": "test-user-id/ds-test-999.csv",
        "original_filename": "revenues.csv",
        "size_bytes": 100,
        "row_count": 10,
        "column_count": 3,
        "metadata": {"columns": ["A", "B", "C"], "dtypes": {}, "sample": []},
        "status": "processed",
        "folder_id": None,
        "created_at": "2026-06-08T00:00:00",
        "updated_at": "2026-06-08T00:00:00"
    }
    with open(LOCAL_DB_PATH, "w") as f:
        json.dump([mock_dataset], f)

    # 3. Move the dataset to the folder
    response = client.patch(
        "/api/datasets/ds-test-999/move",
        json={"folder_id": folder_id}
    )
    assert response.status_code == 200
    assert response.json()["folder_id"] == folder_id

    # 4. Verify in local DB file
    with open(LOCAL_DB_PATH, "r") as f:
        data = json.load(f)
        assert data[0]["folder_id"] == folder_id

    # 5. Move dataset to root (None)
    response = client.patch(
        "/api/datasets/ds-test-999/move",
        json={"folder_id": None}
    )
    assert response.status_code == 200
    assert response.json()["folder_id"] is None
