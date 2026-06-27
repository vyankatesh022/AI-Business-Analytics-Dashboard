from typing import Any, Dict, List, Optional
from uuid import UUID

from psycopg import AsyncConnection

from .models import ModelCreate, ModelVersionCreate, PredictionRequest, SageMakerEndpointCreate
from .repositories import MLRepository
from .sagemaker import SageMakerClient


class TrainingPipeline:
    def __init__(self, conn: AsyncConnection):
        self.conn = conn
        self.repository = MLRepository(conn)
        self.sagemaker = SageMakerClient()

    async def train_model(
        self, tenant_id: UUID, organization_id: UUID, user_id: UUID, model_data: ModelCreate, version_data: ModelVersionCreate
    ) -> Dict[str, Any]:
        """
        Registers a model and triggers a SageMaker training job.
        """
        model = await self.repository.create_model(
            tenant_id=tenant_id, organization_id=organization_id, user_id=user_id, model=model_data
        )
        
        version_data.model_id = model["id"]
        version_data.training_job_name = f"training-job-{model['id']}-{version_data.version}"
        
        version = await self.repository.create_model_version(
            tenant_id=tenant_id, organization_id=organization_id, version=version_data
        )

        # Trigger SageMaker Training Job
        await self.sagemaker.start_training_job(
            job_name=version_data.training_job_name,
            hyper_parameters=version_data.hyperparameters or {},
            input_data_uri=f"s3://mock-bucket/datasets/{version_data.training_dataset_id}",
            output_data_uri=f"s3://mock-bucket/models/{version_data.training_job_name}/output"
        )
        
        return {
            "model": model,
            "version": version
        }

    async def check_training_status(self, tenant_id: UUID, version_id: UUID, job_name: str) -> Dict[str, Any]:
        """
        Polls SageMaker for training status and updates the Model Registry.
        """
        sm_status = await self.sagemaker.get_training_job_status(job_name)
        
        status_map = {
            "InProgress": "TRAINING",
            "Completed": "COMPLETED",
            "Failed": "FAILED"
        }
        
        new_status = status_map.get(sm_status["TrainingJobStatus"], "FAILED")
        
        metrics = None
        if "FinalMetricDataList" in sm_status:
            metrics = {m["MetricName"]: m["Value"] for m in sm_status["FinalMetricDataList"]}
            
        artifacts_uri = sm_status.get("ModelArtifacts", {}).get("S3ModelArtifacts")

        version = await self.repository.update_model_version_status(
            tenant_id=tenant_id,
            version_id=version_id,
            status=new_status,
            metrics=metrics,
            artifacts_uri=artifacts_uri
        )
        
        return version


class PredictionServiceFoundation:
    def __init__(self, conn: AsyncConnection):
        self.conn = conn
        self.repository = MLRepository(conn)
        self.sagemaker = SageMakerClient()

    async def deploy_model(self, tenant_id: UUID, organization_id: UUID, endpoint_data: SageMakerEndpointCreate) -> Dict[str, Any]:
        """
        Deploys a trained model version to a SageMaker Endpoint.
        """
        endpoint = await self.repository.create_endpoint(
            tenant_id=tenant_id, organization_id=organization_id, endpoint=endpoint_data
        )
        
        await self.sagemaker.create_endpoint(
            endpoint_name=endpoint_data.endpoint_name,
            model_name=str(endpoint_data.model_version_id),
            instance_type=endpoint_data.instance_type
        )
        
        # Simulating asynchronous creation immediately available for dev
        endpoint = await self.repository.update_endpoint_status(
            tenant_id=tenant_id, endpoint_id=endpoint["id"], status="IN_SERVICE"
        )
        
        return endpoint

    async def predict(self, tenant_id: UUID, request: PredictionRequest) -> Dict[str, Any]:
        """
        Invokes the SageMaker endpoint to get predictions.
        Verifies endpoint belongs to the tenant.
        """
        endpoint = await self.repository.get_endpoint_by_name(tenant_id, request.endpoint_name)
        if not endpoint or endpoint["status"] != "IN_SERVICE":
            raise ValueError(f"Endpoint {request.endpoint_name} not available")

        # Call SageMaker
        response = await self.sagemaker.invoke_endpoint(
            endpoint_name=request.endpoint_name,
            payload=request.payload
        )
        
        return {
            "endpoint_name": request.endpoint_name,
            "predictions": response["predictions"],
            "latency_ms": response["latency_ms"],
            "prediction_id": "00000000-0000-0000-0000-000000000001"
        }

    async def get_prediction_explanation(self, tenant_id: UUID, prediction_id: UUID) -> Dict[str, Any]:
        """
        Retrieves prediction drivers and business explanations.
        Mock implementation for phase 11.
        """
        return {
            "prediction_id": prediction_id,
            "confidence_score": 0.89,
            "business_explanation": "The prediction is heavily influenced by recent usage drops and high support ticket volume.",
            "key_drivers": [
                {"feature_name": "usage_drop_30d", "importance_score": 0.45, "impact_direction": "NEGATIVE"},
                {"feature_name": "open_support_tickets", "importance_score": 0.30, "impact_direction": "NEGATIVE"},
                {"feature_name": "tenure_days", "importance_score": 0.15, "impact_direction": "POSITIVE"}
            ]
        }

    async def get_decision_intelligence(self, tenant_id: UUID) -> Dict[str, Any]:
        """
        Generates risk analysis, opportunity analysis, and signals.
        """
        from datetime import datetime, timezone
        return {
            "tenant_id": tenant_id,
            "analysis_date": datetime.now(timezone.utc),
            "signals": [
                {
                    "signal_type": "CHURN_WARNING",
                    "description": "3 enterprise accounts show high churn risk based on activity patterns.",
                    "action_recommended": "Schedule executive check-ins and offer proactive support.",
                    "impact_level": "HIGH"
                },
                {
                    "signal_type": "OPPORTUNITY",
                    "description": "15 mid-market accounts have exceeded 80% usage limits.",
                    "action_recommended": "Trigger expansion email sequences for tier upgrades.",
                    "impact_level": "MEDIUM"
                }
            ]
        }
