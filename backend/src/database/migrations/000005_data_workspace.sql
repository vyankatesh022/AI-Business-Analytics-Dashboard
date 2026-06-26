CREATE TABLE workspace_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    parent_id UUID REFERENCES workspace_folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color_label VARCHAR(50),
    description TEXT,
    tags TEXT[],
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_workspace_folders_tenant_org ON workspace_folders(tenant_id, organization_id);
CREATE INDEX idx_workspace_folders_parent_id ON workspace_folders(parent_id);

CREATE TABLE workspace_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    folder_id UUID REFERENCES workspace_folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'ACTIVE',
    format VARCHAR(50),
    size_bytes BIGINT,
    row_count BIGINT,
    file_path VARCHAR(512),
    owner_id UUID NOT NULL,
    version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_workspace_datasets_tenant_org ON workspace_datasets(tenant_id, organization_id);
CREATE INDEX idx_workspace_datasets_folder_id ON workspace_datasets(folder_id);

CREATE TABLE workspace_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    folder_id UUID REFERENCES workspace_folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    host VARCHAR(255),
    port INT,
    database_name VARCHAR(255),
    username VARCHAR(255),
    credentials_encrypted TEXT,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_workspace_connections_tenant_org ON workspace_connections(tenant_id, organization_id);
CREATE INDEX idx_workspace_connections_folder_id ON workspace_connections(folder_id);

CREATE TABLE workspace_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    user_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workspace_activity_log_tenant_org ON workspace_activity_log(tenant_id, organization_id);
