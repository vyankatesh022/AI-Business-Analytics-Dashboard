import io
import os
import json
import urllib.parse
import httpx
import tempfile
import re
import pandas as pd
from typing import Dict, Any, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

async def fetch_remote_dataset(req: Dict[str, Any]) -> Tuple[str, str]:
    """
    Core entrypoint to fetch remote dataset files from various sources.
    Returns: Tuple of (file_path, target_filename)
    """
    source_type = req.get("source_type", "http").lower()
    filename = req.get("filename")

    if source_type in ("http", "api"):
        file_path, inferred_name = await fetch_http_or_api(req)
    elif source_type == "s3":
        file_path, inferred_name = await fetch_s3(req)
    elif source_type == "gcs":
        file_path, inferred_name = await fetch_gcs(req)
    elif source_type == "ftp_sftp":
        file_path, inferred_name = await fetch_ftp_sftp(req)
    elif source_type == "database":
        file_path, inferred_name = await fetch_database(req)
    elif source_type == "github":
        file_path, inferred_name = await fetch_github(req)
    else:
        raise ValueError(f"Unsupported remote source type: {source_type}")

    # Determine final filename
    target_name = filename or inferred_name or "dataset"
    
    # Format conversions (e.g. Parquet or JSON to CSV)
    file_path, target_name = convert_to_csv_if_needed(file_path, target_name)

    return file_path, target_name


async def fetch_http_or_api(req: Dict[str, Any]) -> Tuple[str, str]:
    """Fetches from HTTP URL or REST API endpoints."""
    url = req.get("url")
    if not url:
        raise ValueError("URL is required for HTTP/API import")

    method = req.get("method", "GET").upper()
    headers = req.get("headers") or {}
    body = req.get("body")

    url_path = urllib.parse.urlparse(url).path
    inferred_name = url_path.split("/")[-1] if url_path.split("/")[-1] else "dataset.csv"

    if isinstance(headers, str):
        try:
            headers = json.loads(headers)
        except Exception:
            raise ValueError("HTTP headers must be valid JSON")

    tmp = tempfile.NamedTemporaryFile(delete=False)
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method == "POST":
                data = None
                json_body = None
                if body:
                    try:
                        json_body = json.loads(body)
                    except Exception:
                        data = body
                async with client.stream("POST", url, headers=headers, data=data, json=json_body) as response:
                    if response.status_code != 200:
                        raise RuntimeError(f"HTTP/API fetch failed with status: {response.status_code}")
                    async for chunk in response.aiter_bytes():
                        tmp.write(chunk)
            else:
                async with client.stream("GET", url, headers=headers) as response:
                    if response.status_code != 200:
                        raise RuntimeError(f"HTTP/API fetch failed with status: {response.status_code}")
                    async for chunk in response.aiter_bytes():
                        tmp.write(chunk)
    except Exception:
        tmp.close()
        if os.path.exists(tmp.name):
            os.remove(tmp.name)
        raise
    finally:
        tmp.close()
        
    return tmp.name, inferred_name


async def fetch_s3(req: Dict[str, Any]) -> Tuple[str, str]:
    """Downloads a file from AWS S3."""
    try:
        import boto3
        from botocore.config import Config
    except ImportError:
        raise ImportError("AWS S3 integration requires 'boto3'. Please install it on the backend server.")

    bucket = req.get("s3_bucket")
    key = req.get("s3_key")
    if not bucket or not key:
        raise ValueError("S3 bucket and key are required for S3 import")

    access_key = req.get("aws_access_key_id")
    secret_key = req.get("aws_secret_access_key")
    region = req.get("aws_region")

    s3_config = Config(region_name=region) if region else None
    
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=access_key or None,
        aws_secret_access_key=secret_key or None,
        config=s3_config
    )

    inferred_name = key.split("/")[-1] or "s3_dataset"

    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    try:
        s3_client.download_file(bucket, key, tmp.name)
        return tmp.name, inferred_name
    except Exception as e:
        if os.path.exists(tmp.name):
            os.remove(tmp.name)
        raise RuntimeError(f"S3 download failed: {str(e)}")


async def fetch_gcs(req: Dict[str, Any]) -> Tuple[str, str]:
    """Downloads a file from Google Cloud Storage."""
    try:
        from google.cloud import storage
        from google.oauth2 import service_account
    except ImportError:
        raise ImportError("GCS integration requires 'google-cloud-storage'. Please install it on the backend server.")

    bucket_name = req.get("gcs_bucket")
    blob_name = req.get("gcs_blob")
    sa_json_str = req.get("gcs_service_account_json")

    if not bucket_name or not blob_name:
        raise ValueError("GCS bucket and blob names are required")

    inferred_name = blob_name.split("/")[-1] or "gcs_dataset"

    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    try:
        if sa_json_str:
            info = json.loads(sa_json_str)
            credentials = service_account.Credentials.from_service_account_info(info)
            storage_client = storage.Client(credentials=credentials)
        else:
            storage_client = storage.Client()

        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.download_to_filename(tmp.name)
        return tmp.name, inferred_name
    except Exception as e:
        if os.path.exists(tmp.name):
            os.remove(tmp.name)
        raise RuntimeError(f"GCS download failed: {str(e)}")


async def fetch_ftp_sftp(req: Dict[str, Any]) -> Tuple[str, str]:
    """Fetches a file from FTP or SFTP servers."""
    host = req.get("ftp_host")
    username = req.get("ftp_username")
    password = req.get("ftp_password")
    path = req.get("ftp_path")
    port = req.get("ftp_port")
    use_sftp = req.get("ftp_use_sftp", False)

    if not host or not path:
        raise ValueError("FTP/SFTP host and remote path are required")

    inferred_name = path.split("/")[-1] or "ftp_dataset"

    tmp = tempfile.NamedTemporaryFile(delete=False)
    
    if use_sftp:
        try:
            import paramiko
        except ImportError:
            tmp.close()
            os.remove(tmp.name)
            raise ImportError("SFTP integration requires 'paramiko'. Please install it on the backend server.")
        
        sftp_port = port or 22
        try:
            transport = paramiko.Transport((host, int(sftp_port)))
            transport.connect(username=username, password=password)
            sftp = paramiko.SFTPClient.from_transport(transport)
            
            sftp.get(path, tmp.name)
            
            sftp.close()
            transport.close()
            tmp.close()
            return tmp.name, inferred_name
        except Exception as e:
            tmp.close()
            if os.path.exists(tmp.name):
                os.remove(tmp.name)
            raise RuntimeError(f"SFTP fetch failed: {str(e)}")
    else:
        import ftplib
        ftp_port = port or 21
        try:
            ftp = ftplib.FTP()
            ftp.connect(host, int(ftp_port), timeout=30.0)
            if username:
                ftp.login(username, password)
            else:
                ftp.login()
            
            ftp.retrbinary(f"RETR {path}", tmp.write)
            ftp.quit()
            tmp.close()
            return tmp.name, inferred_name
        except Exception as e:
            tmp.close()
            if os.path.exists(tmp.name):
                os.remove(tmp.name)
            raise RuntimeError(f"FTP fetch failed: {str(e)}")


async def fetch_database(req: Dict[str, Any]) -> Tuple[str, str]:
    """Executes a query on relational databases and returns CSV bytes."""
    try:
        from sqlalchemy import create_engine
    except ImportError:
        raise ImportError("Database import requires 'sqlalchemy'. Please install it on the backend server.")

    db_type = req.get("db_type")
    host = req.get("db_host")
    port = req.get("db_port")
    username = req.get("db_username")
    password = req.get("db_password")
    db_name = req.get("db_name")
    query = req.get("db_query")

    if not db_type or not host or not db_name or not query:
        raise ValueError("Database type, host, database name, and SQL query are required")

    # Clean query and basic SQL injection prevention
    clean_query = re.sub(r'--.*', '', query)
    clean_query = re.sub(r'/\*.*?\*/', '', clean_query, flags=re.DOTALL)
    
    forbidden_pattern = re.compile(r'\b(insert|update|delete|drop|alter|truncate|create|grant|revoke|commit|rollback|exec|execute|merge)\b', re.IGNORECASE)
    
    if forbidden_pattern.search(clean_query):
        raise ValueError("Only read-only SELECT queries are allowed for security validation")
        
    if ';' in clean_query.strip().strip(';'):
        raise ValueError("Multiple statements are not allowed")
        
    if not clean_query.strip().lower().startswith("select"):
        raise ValueError("Query must start with SELECT")

    if db_type == "postgresql":
        driver = "postgresql+psycopg2"
        db_port = port or 5432
    elif db_type == "mysql":
        driver = "mysql+pymysql"
        db_port = port or 3306
    elif db_type == "sqlserver":
        driver = "mssql+pymssql"
        db_port = port or 1433
    else:
        raise ValueError(f"Unsupported database type: {db_type}")

    encoded_password = urllib.parse.quote_plus(password) if password else ""
    connection_uri = f"{driver}://{username}:{encoded_password}@{host}:{db_port}/{db_name}"

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
    tmp.close()
    try:
        engine = create_engine(connection_uri, connect_args={"connect_timeout": 10})
        # Use chunking to stream results directly to disk without exhausting memory
        first_chunk = True
        for chunk in pd.read_sql_query(query, engine, chunksize=10000):
            chunk.to_csv(tmp.name, index=False, mode='a', header=first_chunk)
            first_chunk = False
            
        return tmp.name, f"{db_name}_query.csv"
    except Exception as e:
        if os.path.exists(tmp.name):
            os.remove(tmp.name)
        logger.error(f"Database query execution failed: {str(e)}")
        raise RuntimeError("Database query execution failed. Please check your query and connection settings.")


async def fetch_github(req: Dict[str, Any]) -> Tuple[str, str]:
    """Fetches a file from GitHub repository."""
    repo = req.get("github_repo")
    path = req.get("github_path")
    branch = req.get("github_branch") or "main"
    token = req.get("github_token")

    if not repo or not path:
        raise ValueError("GitHub repository and path are required")

    if "github.com" in repo:
        parts = urllib.parse.urlparse(repo).path.strip("/").split("/")
        if len(parts) >= 2:
            repo = f"{parts[0]}/{parts[1]}"

    inferred_name = path.split("/")[-1] or "github_dataset"

    tmp = tempfile.NamedTemporaryFile(delete=False)
    try:
        if token:
            url = f"https://api.github.com/repos/{repo}/contents/{path}"
            headers = {
                "Authorization": f"token {token}",
                "Accept": "application/vnd.github.v3.raw",
                "User-Agent": "AI-Analytics-Dashboard"
            }
            params = {"ref": branch}
            async with httpx.AsyncClient(timeout=30.0) as client:
                async with client.stream("GET", url, headers=headers, params=params) as response:
                    if response.status_code != 200:
                        raise RuntimeError(f"GitHub API fetch failed with status: {response.status_code}")
                    async for chunk in response.aiter_bytes():
                        tmp.write(chunk)
        else:
            url = f"https://raw.githubusercontent.com/{repo}/{branch}/{path}"
            headers = {"User-Agent": "AI-Analytics-Dashboard"}
            async with httpx.AsyncClient(timeout=30.0) as client:
                async with client.stream("GET", url, headers=headers) as response:
                    if response.status_code != 200:
                        raise RuntimeError(f"GitHub raw fetch failed with status: {response.status_code}")
                    async for chunk in response.aiter_bytes():
                        tmp.write(chunk)
    except Exception:
        tmp.close()
        if os.path.exists(tmp.name):
            os.remove(tmp.name)
        raise
    finally:
        tmp.close()
        
    return tmp.name, inferred_name


def convert_to_csv_if_needed(file_path: str, filename: str) -> Tuple[str, str]:
    """
    Inspects filename extension and content-type.
    Converts Parquet, JSON data, or Excel into standardized CSV.
    """
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext == "parquet":
        try:
            df = pd.read_parquet(file_path)
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
            tmp.close()
            df.to_csv(tmp.name, index=False)
            if os.path.exists(file_path):
                os.remove(file_path)
            base_name = filename.rsplit(".", 1)[0]
            return tmp.name, f"{base_name}.csv"
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise ValueError(f"Failed to parse Parquet content: {str(e)}")

    is_json = (ext == "json")
    if not is_json:
        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                first_char = f.read(1).strip()
                if first_char in ("[", "{"):
                    is_json = True
        except Exception:
            pass

    if is_json:
        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                data_json = json.load(f)
            if isinstance(data_json, dict):
                list_key = next((k for k, v in data_json.items() if isinstance(v, list)), None)
                if list_key:
                    df = pd.DataFrame(data_json[list_key])
                else:
                    df = pd.DataFrame([data_json])
            elif isinstance(data_json, list):
                df = pd.DataFrame(data_json)
            else:
                raise ValueError("JSON content is not a list or object")
                
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
            tmp.close()
            df.to_csv(tmp.name, index=False)
            if os.path.exists(file_path):
                os.remove(file_path)
            base_name = filename.rsplit(".", 1)[0] if "." in filename else filename
            return tmp.name, f"{base_name}.csv"
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise ValueError(f"Failed to parse and convert JSON content: {str(e)}")
            
    return file_path, filename
