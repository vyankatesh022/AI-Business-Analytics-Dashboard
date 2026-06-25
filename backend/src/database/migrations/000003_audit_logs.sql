-- 000003_audit_logs.sql

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor UUID NOT NULL, -- The user_id who performed the action
    action VARCHAR(255) NOT NULL, -- e.g., 'login', 'create_dataset', 'delete_user'
    resource VARCHAR(255) NOT NULL, -- e.g., 'users', 'datasets'
    resource_id UUID, -- Optional: ID of the specific resource modified
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    ip_hash VARCHAR(255), -- Hashed IP address for privacy
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    
    -- NOTE: Never store passwords, tokens, secrets, dataset rows, AI prompts, etc.
);

-- Index for searching audit logs efficiently within a tenant/org
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
