import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from backend.main import app

client = TestClient(app)

# Mocking the current user dependency
# We'll patch backend.auth.dependencies.get_current_user
# Since the datasets router uses Depends(get_current_user), we can override it in the app
from backend.auth.dependencies import get_current_user

async def mock_get_current_user():
    return {"id": "test-user-id", "email": "test@example.com", "role": "Pro"}

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = mock_get_current_user
    yield
    app.dependency_overrides.clear()

@pytest.fixture
def mock_dataset_service():
    with patch("backend.api.datasets.process_and_store_dataset") as mock_process:
        with patch("backend.api.datasets.get_user_datasets") as mock_get:
            with patch("backend.api.datasets.delete_dataset") as mock_delete:
                with patch("backend.api.datasets.rename_dataset") as mock_rename:
                    yield {
                        "process": mock_process,
                        "get": mock_get,
                        "delete": mock_delete,
                        "rename": mock_rename
                    }

@pytest.fixture
def mock_validator():
    with patch("backend.api.datasets.validate_dataset_file") as mock_val:
        yield mock_val

def test_upload_dataset_success(mock_dataset_service, mock_validator):
    mock_dataset_service["process"].return_value = {
        "id": "ds-123",
        "filename": "test-user-id/test.csv",
        "original_filename": "test.csv",
        "status": "processed"
    }
    
    # Create a dummy CSV file
    files = {'file': ('test.csv', b'col1,col2\n1,2', 'text/csv')}
    
    response = client.post("/api/datasets/upload", files=files)
    
    assert response.status_code == 200
    assert response.json()["id"] == "ds-123"
    mock_validator.assert_called_once()
    mock_dataset_service["process"].assert_called_once()

def test_list_datasets(mock_dataset_service):
    mock_dataset_service["get"].return_value = [
        {"id": "ds-123", "original_filename": "test.csv"}
    ]
    
    response = client.get("/api/datasets/")
    
    assert response.status_code == 200
    assert len(response.json()["datasets"]) == 1
    assert response.json()["datasets"][0]["id"] == "ds-123"
    mock_dataset_service["get"].assert_called_once_with("test-user-id")

def test_delete_dataset(mock_dataset_service):
    mock_dataset_service["delete"].return_value = {"message": "Dataset deleted successfully"}
    
    response = client.delete("/api/datasets/ds-123")
    
    assert response.status_code == 200
    assert response.json()["message"] == "Dataset deleted successfully"
    mock_dataset_service["delete"].assert_called_once_with("test-user-id", "ds-123")

def test_rename_dataset(mock_dataset_service):
    mock_dataset_service["rename"].return_value = {
        "id": "ds-123",
        "original_filename": "new_name.csv"
    }
    
    response = client.patch("/api/datasets/ds-123/rename", json={"new_name": "new_name.csv"})
    
    assert response.status_code == 200
    assert response.json()["original_filename"] == "new_name.csv"
    mock_dataset_service["rename"].assert_called_once_with("test-user-id", "ds-123", "new_name.csv")

def test_upload_missing_file():
    response = client.post("/api/datasets/upload")
    assert response.status_code == 422 # Unprocessable Entity due to missing 'file' field

@patch("backend.services.ingestion_service.httpx.AsyncClient")
def test_import_dataset_success(mock_httpx, mock_dataset_service, mock_validator):
    # Mock httpx response using MockStreamContext
    mock_client = MagicMock()
    
    class MockStreamContext:
        def __init__(self, content=b"col1,col2\n1,2"):
            self.content = content
            self.status_code = 200
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass
        async def aiter_bytes(self):
            yield self.content

    # Mock the async context manager method __aenter__
    mock_httpx.return_value.__aenter__.return_value = mock_client
    
    mock_client.stream.return_value = MockStreamContext(b"col1,col2\n1,2")
    
    mock_dataset_service["process"].return_value = {
        "id": "ds-import-123",
        "original_filename": "custom_name.csv",
        "status": "processed"
    }
    
    response = client.post(
        "/api/datasets/import", 
        json={"url": "https://example.com/imported.csv", "filename": "custom_name.csv"}
    )
    
    assert response.status_code == 200
    assert response.json()["id"] == "ds-import-123"
    mock_validator.assert_called_once()
    mock_dataset_service["process"].assert_called_once()

