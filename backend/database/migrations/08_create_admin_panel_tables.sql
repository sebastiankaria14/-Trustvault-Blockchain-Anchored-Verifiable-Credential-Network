-- =============================================
-- Phase 6: Super Admin Panel - Core Tables
-- =============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Super admin accounts
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'super_admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active);

CREATE OR REPLACE FUNCTION update_admins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_admins_updated_at ON admins;
CREATE TRIGGER trigger_update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_admins_updated_at();

-- Dynamic app settings managed from admin panel
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value_json JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_settings_updated_at ON system_settings(updated_at);

CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_system_settings_updated_at ON system_settings;
CREATE TRIGGER trigger_update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_system_settings_updated_at();

INSERT INTO system_settings (key, value_json, description)
VALUES
    ('feature_flags', '{"adminPanelEnabled": true, "maintenanceMode": false}'::jsonb, 'Global feature flags controlled by super admin'),
    ('security_policy', '{"maxLoginAttempts": 5, "sessionTimeoutMinutes": 60}'::jsonb, 'Baseline security controls for admin-managed policies'),
    ('notifications', '{"institutionApprovalEmail": true, "verifierApprovalEmail": true}'::jsonb, 'Notification controls for operational events')
ON CONFLICT (key) DO NOTHING;

-- Default development admin account (password: Admin@123)
INSERT INTO admins (email, password_hash, full_name, role, is_active)
VALUES (
    'admin@trustvault.io',
    '$2a$10$6zwwa9Rgg/tEHBHTt.pnG.7xVdwo1jgmFEBdS9dcEtQ8AtvYe3geS',
    'TrustVault Super Admin',
    'super_admin',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE admins IS 'Super admin accounts for internal platform operations';
COMMENT ON TABLE system_settings IS 'System-level settings editable from the Super Admin panel';