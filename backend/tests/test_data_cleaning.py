import pytest
import pandas as pd
import numpy as np
from fastapi import HTTPException
from backend.automation.data_cleaning.engine import DataCleaningEngine
from backend.automation.data_cleaning.appsec_agent import AppSecAgent
from backend.automation.data_cleaning.validation_agent import ValidationAgent
from backend.automation.data_cleaning.outlier_agent import OutlierAgent
from backend.automation.data_cleaning.cleaning_agent import CleaningAgent

@pytest.fixture
def sample_df():
    data = {
        "id": [1, 2, 3, 4, 5, 5, 6],
        "name": ["Alice", "Bob", "Charlie", None, "Eve", "Eve", "Frank"],
        "age": [25, 30, 200, 22, np.nan, np.nan, 28], # 200 is outlier
        "email": ["alice@example.com", "invalid-email", "charlie@foo.com", "dan@bar.com", "eve@baz.com", "eve@baz.com", "frank@qux.com"]
    }
    return pd.DataFrame(data)

def test_appsec_agent(sample_df):
    metadata = {"enforce_auth": False}
    result = AppSecAgent.validate(sample_df, metadata)
    assert result["passed"] is True

    # Test oversized DataFrame
    large_df = pd.DataFrame(np.random.randint(0, 100, size=(100, 1001))) # >1000 cols
    result = AppSecAgent.validate(large_df, metadata)
    assert result["passed"] is False
    assert "columns" in result["reason"]

def test_validation_agent(sample_df):
    report = ValidationAgent.analyze(sample_df)
    assert report["total_rows"] == 7
    assert report["duplicate_rows"] == 1
    assert report["missing_cells"] == 3 # 1 name, 2 ages
    assert report["columns"]["age"]["missing_count"] == 2

def test_outlier_agent(sample_df):
    report = OutlierAgent.detect_outliers(sample_df, method="iqr", threshold=1.5)
    assert "age" in report
    assert report["age"]["outlier_count"] == 1

def test_cleaning_agent(sample_df):
    operations = [
        {"action": "remove_duplicates", "subset": None},
        {"action": "handle_missing", "column": "age", "method": "replace_median"},
        {"action": "remove_invalid", "column": "email", "invalid_type": "email"}
    ]
    cleaned_df = CleaningAgent.clean(sample_df, operations)
    
    # 7 rows originally, 1 duplicate -> 6 rows
    assert len(cleaned_df) == 6
    # Age has 2 NaNs, replaced with median
    assert cleaned_df["age"].isna().sum() == 0
    # "invalid-email" should be replaced with NaN
    assert cleaned_df["email"].isna().sum() == 1

def test_engine_analyze(sample_df):
    report = DataCleaningEngine.analyze(sample_df)
    assert "validation_report" in report
    assert "outlier_report" in report
    assert "recommendations" in report
    
    recs = report["recommendations"]
    assert len(recs) > 0
    # Should recommend duplicate removal
    assert any(r["operation"]["action"] == "remove_duplicates" for r in recs if r["operation"])

def test_engine_clean(sample_df):
    operations = [{"action": "remove_duplicates"}]
    cleaned_df, qa_report = DataCleaningEngine.clean(sample_df, operations)
    assert len(cleaned_df) == 6
    assert qa_report["new_duplicates"] == 0
