import pytest
from datetime import datetime, timezone
from uuid import uuid4
from src.domains.processing.models import (
    ProcessingJobCreate, 
    ValidationRule, 
    ProcessingJobConfig,
    ProcessingTaskStatusUpdate,
    DataQualityReportCreate
)
from src.domains.features.models import (
    FeatureCreate,
    FeatureGroupCreate
)
from src.domains.ml.models import (
    ModelCreate,
    ModelVersionCreate,
    SageMakerEndpointCreate,
    PredictionRequest
)
from pydantic import ValidationError

def test_processing_job_create_valid():
    dataset_id = uuid4()
    job = ProcessingJobCreate(
        dataset_id=dataset_id,
        name="Test Validation",
        type="VALIDATION",
        config=ProcessingJobConfig(
            validation_rules=[
                ValidationRule(rule_type="not_null", column_name="email")
            ]
        )
    )
    assert job.name == "Test Validation"
    assert job.type == "VALIDATION"
    assert len(job.config.validation_rules) == 1
    assert job.config.validation_rules[0].rule_type == "not_null"

def test_processing_job_create_invalid_config():
    dataset_id = uuid4()
    with pytest.raises(ValidationError):
        ProcessingJobCreate(
            dataset_id=dataset_id,
            name="Test Validation",
            type="VALIDATION",
            config={
                "validation_rules": [
                    {"missing_rule_type": "not_null"} # Invalid rule
                ]
            }
        )

def test_data_quality_report_create_valid():
    dataset_id = uuid4()
    report = DataQualityReportCreate(
        dataset_id=dataset_id,
        overall_score=95.5,
        completeness_score=99.0
    )
    assert report.overall_score == 95.5
    assert report.completeness_score == 99.0

def test_feature_create_valid():
    feature = FeatureCreate(
        name="user_login_count_7d",
        data_type="INTEGER",
        feature_type="NUMERICAL",
        is_active=True
    )
    assert feature.name == "user_login_count_7d"
    assert feature.data_type == "INTEGER"

def test_feature_group_create_valid():
    group = FeatureGroupCreate(
        name="User Activity",
        entity_type="USER",
        storage_type="BOTH"
    )
    assert group.entity_type == "USER"
    assert group.storage_type == "BOTH"

def test_model_create_valid():
    model = ModelCreate(
        name="Churn Model",
        model_type="CHURN_PREDICTION",
        problem_type="CLASSIFICATION"
    )
    assert model.name == "Churn Model"
    assert model.problem_type == "CLASSIFICATION"

def test_prediction_request_valid():
    req = PredictionRequest(
        endpoint_name="churn-v1-prod",
        payload={"features": [1.0, 0.5, 3]}
    )
    assert req.endpoint_name == "churn-v1-prod"
    assert "features" in req.payload
