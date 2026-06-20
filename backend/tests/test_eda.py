import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from backend.main import app
import pandas as pd
import numpy as np

client = TestClient(app)

from backend.auth.dependencies import get_current_user

async def mock_get_current_user():
    return {"id": "test-user-id", "email": "test@example.com", "role": "Pro"}

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = mock_get_current_user
    yield
    app.dependency_overrides.clear()

@pytest.fixture
def sample_dataframe():
    data = {
        "id": [1, 2, 3, 4, 5],
        "age": [25, 30, np.nan, 40, 25],
        "category": ["A", "B", "A", "C", "A"],
        "score": [85.5, 90.0, 78.5, 92.0, 88.0]
    }
    return pd.DataFrame(data)

def test_generate_eda_report_success():
    from backend.analytics.eda import generate_eda_report
    data = {
        "age": [25, 30, np.nan, 40, 25],
        "score": [85.5, 90.0, 78.5, 92.0, 88.0]
    }
    df = pd.DataFrame(data)
    report = generate_eda_report(df)
    
    assert report["status"] == "success"
    assert report["summary"]["row_count"] == 5
    assert report["summary"]["column_count"] == 2
    assert report["missing_data"]["total_missing"] == 1
    
    # check numerical stats
    assert "age" in report["numerical_analysis"]
    assert report["numerical_analysis"]["age"]["mean"] == 30.0
    assert report["numerical_analysis"]["age"]["median"] == 27.5
    assert report["numerical_analysis"]["age"]["mode"] == 25.0
    
    # check correlation
    assert "pearson" in report["correlation_analysis"]
    assert "score" in report["correlation_analysis"]["pearson"]["age"]

def test_generate_eda_report_empty():
    from backend.analytics.eda import generate_eda_report
    df = pd.DataFrame()
    report = generate_eda_report(df)
    assert report["status"] == "error"

@patch("backend.api.eda.get_dataset_content")
def test_get_dataset_eda_endpoint_success(mock_get_content, sample_dataframe):
    mock_get_content.return_value = sample_dataframe
    
    response = client.get("/api/datasets/ds-123/eda")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["summary"]["row_count"] == 5
    assert data["summary"]["column_count"] == 4
    assert data["missing_data"]["total_missing"] == 1
    mock_get_content.assert_called_once_with("test-user-id", "ds-123")

@patch("backend.api.eda.get_dataset_content")
def test_get_dataset_eda_endpoint_not_found(mock_get_content):
    from fastapi import HTTPException
    mock_get_content.side_effect = HTTPException(status_code=404, detail="Dataset not found or unauthorized")
    
    response = client.get("/api/datasets/ds-unknown/eda")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Dataset not found or unauthorized"

