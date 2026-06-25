-- 000002_rbac.sql

-- Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permissions Table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions Mapping
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- User Roles Mapping (Supports multi-tenant role assignment)
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id, tenant_id)
);

-- Insert Default Roles
INSERT INTO roles (name, description) VALUES
('Owner', 'Full platform control'),
('Admin', 'Manage users, datasets, reports, analytics'),
('Analyst', 'View analytics, create reports, run AI and predictions'),
('Viewer', 'Read-only access to dashboards and reports');

-- Insert Core Permissions
INSERT INTO permissions (name) VALUES
('analytics.read'),
('analytics.write'),
('datasets.read'),
('datasets.write'),
('reports.read'),
('reports.write'),
('predictions.read'),
('predictions.run'),
('ai.read'),
('ai.run'),
('billing.read'),
('billing.manage'),
('organization.read'),
('organization.manage'),
('user.read'),
('user.manage'),
('audit.read');

-- Owner Permissions (All)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'Owner';

-- Admin Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'Admin' AND p.name IN (
    'analytics.read', 'analytics.write',
    'datasets.read', 'datasets.write',
    'reports.read', 'reports.write',
    'predictions.read', 'predictions.run',
    'ai.read', 'ai.run',
    'organization.read',
    'user.read', 'user.manage',
    'audit.read'
);

-- Analyst Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'Analyst' AND p.name IN (
    'analytics.read',
    'datasets.read',
    'reports.read', 'reports.write',
    'predictions.read', 'predictions.run',
    'ai.read', 'ai.run'
);

-- Viewer Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'Viewer' AND p.name IN (
    'analytics.read',
    'reports.read'
);
