-- Phase 7: Enterprise Data Processing, Feature Store & ML Foundation

-- ==============================================================================
-- 1. DATASET ENHANCEMENTS & SCHEMAS
-- ==============================================================================

CREATE TABLE dataset_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    dataset_id UUID NOT NULL REFERENCES workspace_datasets(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    schema_metadata JSONB NOT NULL, -- Detailed column types, nullability, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dataset_schemas_tenant_org ON dataset_schemas(tenant_id, organization_id);
CREATE INDEX idx_dataset_schemas_dataset_id ON dataset_schemas(dataset_id);

CREATE TABLE data_quality_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    dataset_id UUID NOT NULL REFERENCES workspace_datasets(id) ON DELETE CASCADE,
    job_id UUID, -- References processing_jobs(id)
    overall_score NUMERIC(5, 2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    completeness_score NUMERIC(5, 2),
    accuracy_score NUMERIC(5, 2),
    consistency_score NUMERIC(5, 2),
    validity_score NUMERIC(5, 2),
    uniqueness_score NUMERIC(5, 2),
    timeliness_score NUMERIC(5, 2),
    profiling_data JSONB, -- Row count, min, max, mean, cardinality, etc.
    recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dq_reports_tenant_org ON data_quality_reports(tenant_id, organization_id);
CREATE INDEX idx_dq_reports_dataset_id ON data_quality_reports(dataset_id);

-- ==============================================================================
-- 2. PROCESSING JOBS & HISTORY
-- ==============================================================================

CREATE TABLE processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    dataset_id UUID NOT NULL REFERENCES workspace_datasets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'VALIDATION', 'CLEANING', 'PROFILING', 'FEATURE_ENGINEERING', etc.
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'PAUSED', 'CANCELLED'
    config JSONB, -- Configuration and rules used
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_processing_jobs_tenant_org ON processing_jobs(tenant_id, organization_id);
CREATE INDEX idx_processing_jobs_dataset_id ON processing_jobs(dataset_id);
CREATE INDEX idx_processing_jobs_status ON processing_jobs(status);

CREATE TABLE processing_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    job_id UUID NOT NULL REFERENCES processing_jobs(id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    logs JSONB, -- Warnings, specific row errors, processing history details
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_processing_tasks_job_id ON processing_tasks(job_id);

-- ==============================================================================
-- 3. FEATURE STORE
-- ==============================================================================

CREATE TABLE feature_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    entity_type VARCHAR(100) NOT NULL, -- e.g., 'USER', 'PRODUCT', 'DATASET'
    storage_type VARCHAR(50) NOT NULL DEFAULT 'OFFLINE', -- 'OFFLINE', 'ONLINE', 'BOTH'
    s3_uri TEXT, -- Location in S3 for offline store
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_feature_groups_tenant_org ON feature_groups(tenant_id, organization_id);
CREATE UNIQUE INDEX uq_feature_groups_name_tenant ON feature_groups(tenant_id, name);

CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    feature_group_id UUID NOT NULL REFERENCES feature_groups(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    data_type VARCHAR(50) NOT NULL, -- 'INTEGER', 'FLOAT', 'STRING', 'BOOLEAN', 'DATETIME'
    feature_type VARCHAR(50) NOT NULL, -- 'CATEGORICAL', 'NUMERICAL', 'TIME_SERIES'
    logic JSONB, -- Logic/rules used to engineer this feature
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_features_tenant_org ON features(tenant_id, organization_id);
CREATE INDEX idx_features_group_id ON features(feature_group_id);
CREATE UNIQUE INDEX uq_features_name_group ON features(feature_group_id, name);

-- ==============================================================================
-- 4. MACHINE LEARNING & AWS SAGEMAKER FOUNDATION
-- ==============================================================================

CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    model_type VARCHAR(100) NOT NULL, -- 'CHURN_PREDICTION', 'REVENUE_FORECAST', 'ANOMALY_DETECTION'
    problem_type VARCHAR(50) NOT NULL, -- 'CLASSIFICATION', 'REGRESSION', 'CLUSTERING'
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_models_tenant_org ON models(tenant_id, organization_id);
CREATE UNIQUE INDEX uq_models_name_tenant ON models(tenant_id, name);

CREATE TABLE model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    training_job_name VARCHAR(255), -- SageMaker Training Job Name
    training_dataset_id UUID REFERENCES workspace_datasets(id) ON DELETE SET NULL,
    feature_group_id UUID REFERENCES feature_groups(id) ON DELETE SET NULL,
    metrics JSONB, -- Evaluation metrics (accuracy, F1, RMSE, etc.)
    status VARCHAR(50) NOT NULL DEFAULT 'TRAINING', -- 'TRAINING', 'COMPLETED', 'FAILED', 'READY'
    s3_model_artifacts_uri TEXT,
    hyperparameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_model_versions_model_id ON model_versions(model_id);
CREATE UNIQUE INDEX uq_model_versions_version ON model_versions(model_id, version);

CREATE TABLE sagemaker_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    model_version_id UUID NOT NULL REFERENCES model_versions(id) ON DELETE CASCADE,
    endpoint_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CREATING', -- 'CREATING', 'IN_SERVICE', 'UPDATING', 'FAILED', 'DELETED'
    instance_type VARCHAR(50) NOT NULL,
    deployed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sagemaker_endpoints_tenant_org ON sagemaker_endpoints(tenant_id, organization_id);
CREATE UNIQUE INDEX uq_sagemaker_endpoints_name ON sagemaker_endpoints(endpoint_name);
