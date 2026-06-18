import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import io
import pandas as pd
from backend.main import app
from backend.auth.dependencies import get_current_user

client = TestClient(app)

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
        yield mock_process

@pytest.fixture
def mock_validator():
    with patch("backend.api.datasets.validate_dataset_file") as mock_val:
        yield mock_val

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

# 1. HTTP Ingestion
@patch("backend.services.ingestion_service.httpx.AsyncClient")
def test_import_http_success(mock_httpx, mock_dataset_service, mock_validator):
    mock_client = MagicMock()
    mock_httpx.return_value.__aenter__.return_value = mock_client
    
    mock_client.stream.return_value = MockStreamContext(b"col1,col2\n1,2")
    
    mock_dataset_service.return_value = {
        "id": "ds-http-123",
        "original_filename": "remote_data.csv",
        "status": "processed"
    }

    response = client.post(
        "/api/datasets/import",
        json={
            "source_type": "http",
            "url": "https://example.com/remote_data.csv",
            "filename": "remote_data.csv"
        }
    )

    assert response.status_code == 200
    assert response.json()["id"] == "ds-http-123"
    mock_validator.assert_called_once()
    mock_dataset_service.assert_called_once()

# 2. REST API Ingestion
@patch("backend.services.ingestion_service.httpx.AsyncClient")
def test_import_rest_api_success(mock_httpx, mock_dataset_service, mock_validator):
    mock_client = MagicMock()
    mock_httpx.return_value.__aenter__.return_value = mock_client
    
    mock_client.stream.return_value = MockStreamContext(b'[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]')
    
    mock_dataset_service.return_value = {
        "id": "ds-api-123",
        "original_filename": "api_data.csv",
        "status": "processed"
    }

    response = client.post(
        "/api/datasets/import",
        json={
            "source_type": "api",
            "url": "https://api.example.com/users",
            "method": "POST",
            "headers": '{"Authorization": "Bearer secret_token"}',
            "body": '{"role": "admin"}',
            "filename": "api_data"
        }
    )

    assert response.status_code == 200
    assert response.json()["id"] == "ds-api-123"
    mock_dataset_service.assert_called_once()
    args, kwargs = mock_dataset_service.call_args
    mock_file = args[1]
    assert mock_file.filename == "api_data.csv"

# 3. AWS S3 Ingestion
@patch("boto3.client")
def test_import_s3_success(mock_boto_client, mock_dataset_service, mock_validator):
    mock_s3 = MagicMock()
    mock_boto_client.return_value = mock_s3
    
    def mock_download(bucket, key, filename, *args, **kwargs):
        with open(filename, "wb") as f:
            f.write(b"s1,s2\nhello,world")
        return None
    mock_s3.download_file.side_effect = mock_download

    mock_dataset_service.return_value = {
        "id": "ds-s3-123",
        "original_filename": "s3_data.csv",
        "status": "processed"
    }

    response = client.post(
        "/api/datasets/import",
        json={
            "source_type": "s3",
            "s3_bucket": "my-bucket",
            "s3_key": "raw/s3_data.csv",
            "aws_access_key_id": "key",
            "aws_secret_access_key": "secret",
            "aws_region": "us-east-1"
        }
    )

    assert response.status_code == 200
    assert response.json()["id"] == "ds-s3-123"
    mock_s3.download_file.assert_called_once()
    
# 4. GCS Ingestion
@patch("google.oauth2.service_account.Credentials.from_service_account_info")
@patch("google.cloud.storage.Client")
def test_import_gcs_success(mock_gcs_client, mock_from_info, mock_dataset_service, mock_validator):
    mock_client = MagicMock()
    mock_gcs_client.return_value = mock_client
    mock_bucket = MagicMock()
    mock_blob = MagicMock()
    
    mock_client.bucket.return_value = mock_bucket
    mock_bucket.blob.return_value = mock_blob
    
    def mock_download_to_filename(filename, *args, **kwargs):
        with open(filename, "wb") as f:
            f.write(b"g1,g2\n3,4")
    mock_blob.download_to_filename.side_effect = mock_download_to_filename
    
    mock_from_info.return_value = MagicMock()

    mock_dataset_service.return_value = {
        "id": "ds-gcs-123",
        "original_filename": "gcs_data.csv",
        "status": "processed"
    }

    response = client.post(
        "/api/datasets/import",
        json={
            "source_type": "gcs",
            "gcs_bucket": "my-gcs-bucket",
            "gcs_blob": "folder/gcs_data.csv",
            "gcs_service_account_json": '{"type": "service_account", "project_id": "p"}'
        }
    )

    assert response.status_code == 200
    assert response.json()["id"] == "ds-gcs-123"
    mock_blob.download_to_filename.assert_called_once()

# 5. SFTP Ingestion
@patch("paramiko.Transport")
@patch("paramiko.SFTPClient.from_transport")
def test_import_sftp_success(mock_sftp_client, mock_transport, mock_dataset_service, mock_validator):
    mock_sftp = MagicMock()
    mock_sftp_client.return_value = mock_sftp
    
    def mock_get(path, localpath):
        with open(localpath, "wb") as f:
            f.write(b"sftp1,sftp2\nval1,val2")
        return None
    mock_sftp.get.side_effect = mock_get

    mock_dataset_service.return_value = {
        "id": "ds-sftp-123",
        "original_filename": "sftp_data.csv",
        "status": "processed"
    }

    response = client.post(
        "/api/datasets/import",
        json={
            "source_type": "ftp_sftp",
            "ftp_host": "sftp.example.com",
            "ftp_username": "user",
            "ftp_password": "pass",
            "ftp_path": "/home/user/sftp_data.csv",
            "ftp_use_sftp": True
        }
    )

    assert response.status_code == 200
    assert response.json()["id"] == "ds-sftp-123"
    mock_sftp.get.assert_called_once()

# 6. Database Ingestion
@patch("sqlalchemy.create_engine")
@patch("backend.services.ingestion_service.pd.read_sql_query")
def test_import_database_success(mock_read_sql, mock_create_engine, mock_dataset_service, mock_validator):
    mock_engine = MagicMock()
    mock_create_engine.return_value = mock_engine
    
    mock_df = pd.DataFrame({"db_col1": [1, 2], "db_col2": ["A", "B"]})
    # read_sql_query with chunksize returns an iterator
    mock_read_sql.return_value = [mock_df]

    mock_dataset_service.return_value = {
        "id": "ds-db-123",
        "original_filename": "my_db_query.csv",
        "status": "processed"
    }

    response = client.post(
        "/api/datasets/import",
        json={
            "source_type": "database",
            "db_type": "postgresql",
            "db_host": "localhost",
            "db_port": 5432,
            "db_username": "postgres",
            "db_password": "password",
            "db_name": "analytics",
            "db_query": "SELECT * FROM sales LIMIT 10",
            "filename": "my_db_query"
        }
    )

    assert response.status_code == 200
    assert response.json()["id"] == "ds-db-123"
    # check that chunksize was passed
    mock_read_sql.assert_called_once_with("SELECT * FROM sales LIMIT 10", mock_engine, chunksize=10000)

# 7. GitHub Ingestion
@patch("backend.services.ingestion_service.httpx.AsyncClient")
def test_import_github_success(mock_httpx, mock_dataset_service, mock_validator):
    mock_client = MagicMock()
    mock_httpx.return_value.__aenter__.return_value = mock_client
    
    mock_client.stream.return_value = MockStreamContext(b"gh1,gh2\n5,6")
    
    mock_dataset_service.return_value = {
        "id": "ds-gh-123",
        "original_filename": "github_data.csv",
        "status": "processed"
    }

    response = client.post(
        "/api/datasets/import",
        json={
            "source_type": "github",
            "github_repo": "owner/my-repo",
            "github_path": "data/github_data.csv",
            "github_branch": "main",
            "github_token": "token123"
        }
    )

    assert response.status_code == 200
    assert response.json()["id"] == "ds-gh-123"
    
# 8. Parquet Conversion
@patch("backend.services.ingestion_service.pd.read_parquet")
@patch("backend.services.ingestion_service.httpx.AsyncClient")
def test_import_parquet_conversion(mock_httpx, mock_read_parquet, mock_dataset_service, mock_validator):
    mock_client = MagicMock()
    mock_httpx.return_value.__aenter__.return_value = mock_client
    
    mock_client.stream.return_value = MockStreamContext(b"fake-parquet-bytes")
    
    # Mock Parquet loading
    mock_read_parquet.return_value = pd.DataFrame({"col_p": [9.9]})
    
    mock_dataset_service.return_value = {
        "id": "ds-parquet-123",
        "original_filename": "data.csv",
        "status": "processed"
    }

    response = client.post(
        "/api/datasets/import",
        json={
            "source_type": "http",
            "url": "https://example.com/data.parquet"
        }
    )

    assert response.status_code == 200
    assert response.json()["id"] == "ds-parquet-123"
    args, kwargs = mock_dataset_service.call_args
    mock_file = args[1]
    assert mock_file.filename == "data.csv"
