-- =============================================
-- Phase 6: Approval Workflow Audit + Notifications
-- =============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_approval_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(30) NOT NULL CHECK (entity_type IN ('user', 'institution', 'verifier')),
    entity_id UUID NOT NULL,
    entity_email VARCHAR(255),
    previous_status VARCHAR(30),
    new_status VARCHAR(30),
    action VARCHAR(40) NOT NULL CHECK (action IN ('approve', 'reject', 'suspend', 'reset', 'request_more_info', 'block', 'unblock')),
    reason TEXT,
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_approval_logs_entity ON admin_approval_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_approval_logs_action ON admin_approval_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_approval_logs_created_at ON admin_approval_logs(created_at);

CREATE TABLE IF NOT EXISTS notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_type VARCHAR(30) NOT NULL CHECK (recipient_type IN ('user', 'institution', 'verifier')),
    recipient_id UUID,
    recipient_email VARCHAR(255),
    event_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    delivered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notification_events_recipient ON notification_events(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_event_type ON notification_events(event_type);
CREATE INDEX IF NOT EXISTS idx_notification_events_created_at ON notification_events(created_at);

COMMENT ON TABLE admin_approval_logs IS 'Audit trail of all super admin approval decisions and account governance actions';
COMMENT ON TABLE notification_events IS 'Notification outbox for approval and governance events';
