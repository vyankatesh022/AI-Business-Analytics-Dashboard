-- Phase 9: Enterprise Reporting Platform
-- Required for Report Builder, Scheduling, Sharing, and Versioning

BEGIN;

-- ENUMs for Reporting
CREATE TYPE report_type AS ENUM ('EXECUTIVE', 'REVENUE', 'KPI', 'RETENTION', 'CHURN', 'FUNNEL', 'COHORT', 'PRODUCT', 'MARKETING', 'SUBSCRIPTION', 'OPERATIONAL', 'CUSTOM');
CREATE TYPE report_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE export_format AS ENUM ('CSV', 'XLSX', 'PDF');
CREATE TYPE export_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE schedule_type AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'CUSTOM');
CREATE TYPE share_type AS ENUM ('ORGANIZATION', 'TEAM', 'USER', 'ROLE', 'PUBLIC_LINK');

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    report_type report_type NOT NULL DEFAULT 'CUSTOM',
    status report_status NOT NULL DEFAULT 'DRAFT',
    version INT NOT NULL DEFAULT 1,
    blocks JSONB NOT NULL DEFAULT '[]'::jsonb, -- Stores the drag-and-drop block definitions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_account_id ON reports(account_id);
CREATE INDEX idx_reports_author_id ON reports(author_id);
CREATE INDEX idx_reports_status ON reports(status);

-- Report Versions Table for rollback
CREATE TABLE IF NOT EXISTS report_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    version_num INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    blocks JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_report_versions_report_id ON report_versions(report_id);
CREATE INDEX idx_report_versions_account_id ON report_versions(account_id);

-- Report Schedules Table
CREATE TABLE IF NOT EXISTS report_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id),
    schedule_type schedule_type NOT NULL,
    cron_expression VARCHAR(100), -- For CUSTOM schedules
    recipients JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of user IDs or emails
    delivery_methods JSONB NOT NULL DEFAULT '["EMAIL"]'::jsonb, -- EMAIL, WORKSPACE, LINK
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_report_schedules_account_id ON report_schedules(account_id);
CREATE INDEX idx_report_schedules_report_id ON report_schedules(report_id);
CREATE INDEX idx_report_schedules_next_run ON report_schedules(next_run_at) WHERE is_active = TRUE;

-- Report Exports Table
CREATE TABLE IF NOT EXISTS report_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES users(id),
    format export_format NOT NULL,
    status export_status NOT NULL DEFAULT 'PENDING',
    s3_key VARCHAR(1024), -- Set when completed
    error_message TEXT,
    expires_at TIMESTAMP WITH TIME ZONE, -- For temporary download links
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_report_exports_account_id ON report_exports(account_id);
CREATE INDEX idx_report_exports_report_id ON report_exports(report_id);

-- Report Shares Table
CREATE TABLE IF NOT EXISTS report_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id),
    share_type share_type NOT NULL,
    target_id UUID, -- Team ID, User ID, or Role ID depending on share_type
    permission_level VARCHAR(50) NOT NULL DEFAULT 'VIEW', -- VIEW, EDIT
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_report_shares_report_id ON report_shares(report_id);
CREATE INDEX idx_report_shares_account_id ON report_shares(account_id);
CREATE INDEX idx_report_shares_target_id ON report_shares(target_id);



COMMIT;
