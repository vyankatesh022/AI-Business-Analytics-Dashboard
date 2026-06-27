-- Phase 8: Analytics Engine

-- Dashboards
CREATE TABLE IF NOT EXISTS dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    layout JSONB DEFAULT '[]', -- Grid layout definition
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dashboards_account_id ON dashboards(account_id);

-- Dashboard Cards (Widgets)
CREATE TABLE IF NOT EXISTS dashboard_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    account_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'kpi', 'chart', 'cohort', 'funnel'
    title VARCHAR(255) NOT NULL,
    config JSONB NOT NULL, -- Widget specific configuration (e.g., metric, grouping)
    position JSONB NOT NULL, -- x, y, w, h
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dashboard_cards_dashboard_id ON dashboard_cards(dashboard_id);
CREATE INDEX idx_dashboard_cards_account_id ON dashboard_cards(account_id);

-- KPI Definitions
CREATE TABLE IF NOT EXISTS kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dataset_id UUID NOT NULL, -- Reference to workspace dataset
    metric_type VARCHAR(50) NOT NULL, -- 'count', 'sum', 'average', 'distinct_count'
    metric_column VARCHAR(255),
    filters JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kpi_definitions_account_id ON kpi_definitions(account_id);

-- Cohort Definitions
CREATE TABLE IF NOT EXISTS cohort_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dataset_id UUID NOT NULL,
    start_event VARCHAR(255) NOT NULL,
    return_event VARCHAR(255) NOT NULL,
    time_window INTERVAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cohort_definitions_account_id ON cohort_definitions(account_id);

-- Funnel Definitions
CREATE TABLE IF NOT EXISTS funnel_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dataset_id UUID NOT NULL,
    steps JSONB NOT NULL, -- Array of events forming the funnel
    conversion_window INTERVAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_funnel_definitions_account_id ON funnel_definitions(account_id);

-- Segment Definitions
CREATE TABLE IF NOT EXISTS segment_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dataset_id UUID NOT NULL,
    rules JSONB NOT NULL, -- Segmentation rules
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_segment_definitions_account_id ON segment_definitions(account_id);
