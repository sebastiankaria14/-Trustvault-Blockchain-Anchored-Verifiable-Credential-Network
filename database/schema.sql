-- TrustVault Database Schema
-- PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS verification_logs CASCADE;
DROP TABLE IF EXISTS consent_tiers CASCADE;
DROP TABLE IF EXISTS consent_records CASCADE;
DROP TABLE IF EXISTS credential_shares CASCADE;
DROP TABLE IF EXISTS credentials CASCADE;
DROP TABLE IF EXISTS verifier_api_keys CASCADE;
DROP TABLE IF EXISTS institution_staff CASCADE;
DROP TABLE IF EXISTS verifiers CASCADE;
DROP TABLE IF EXISTS institutions CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Super Admins Table (Internal platform operators)
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'super_admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- System Settings (Controlled by super admin)
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value_json JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (End Users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,

    -- KYC Information
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
    kyc_document_type VARCHAR(50),
    kyc_document_url VARCHAR(500),
    kyc_verified_at TIMESTAMP,

    -- Security
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(100),

    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Institutions Table (Colleges, Banks, Hospitals, etc.)
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('education', 'financial', 'healthcare', 'government', 'employer', 'other')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Institution Details
    registration_number VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    website VARCHAR(255),

    -- Verification & Status
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
    verification_documents TEXT[], -- Array of document URLs
    verified_at TIMESTAMP,

    -- API Access
    api_key VARCHAR(255) UNIQUE,
    api_enabled BOOLEAN DEFAULT FALSE,

    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Institution Staff (Additional users for institutions)
CREATE TABLE institution_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'viewer')),

    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Verifiers Table (Organizations that verify credentials)
CREATE TABLE verifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Company Details
    industry VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    website VARCHAR(255),

    -- Verification & Status
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
    verification_documents TEXT[],
    verified_at TIMESTAMP,

    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Verifier API Keys (Separate table for better management)
CREATE TABLE verifier_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verifier_id UUID REFERENCES verifiers(id) ON DELETE CASCADE,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100), -- Key name/description
    is_active BOOLEAN DEFAULT TRUE,
    rate_limit INTEGER DEFAULT 1000, -- Requests per hour
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP
);

-- Credentials Table (Issued Credentials)
CREATE TABLE credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,

    -- Credential Details
    credential_type VARCHAR(50) NOT NULL CHECK (credential_type IN ('degree', 'diploma', 'certificate', 'transcript', 'salary_slip', 'employment_letter', 'bank_statement', 'medical_record', 'identity_document', 'other')),
    credential_name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Credential Data (JSON format for flexibility)
    credential_data JSONB NOT NULL,
    -- Example: {"degree": "Bachelor of Science", "major": "Computer Science", "gpa": 3.8, "graduation_year": 2024}

    -- Files
    document_url VARCHAR(500),

    -- Blockchain
    did VARCHAR(255) UNIQUE,
    blockchain_hash VARCHAR(255) UNIQUE, -- SHA-256 hash of credential
    blockchain_tx_hash VARCHAR(255), -- Transaction hash from blockchain
    blockchain_network VARCHAR(50) DEFAULT 'polygon-mumbai',

    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    revoked_at TIMESTAMP,
    revoke_reason TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consent Records (User consent for credential sharing)
CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES verifiers(id) ON DELETE CASCADE,
    credential_id UUID REFERENCES credentials(id) ON DELETE CASCADE,

    -- Consent Details
    purpose TEXT, -- Why access is requested
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'granted', 'revoked', 'expired')),

    -- Validity
    granted_at TIMESTAMP,
    expires_at TIMESTAMP,
    revoked_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consent Tiers (Type-based user consent for verifier access)
CREATE TABLE consent_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES verifiers(id) ON DELETE CASCADE,
    credential_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'granted', 'revoked', 'expired')),
    granted_at TIMESTAMP,
    expires_at TIMESTAMP,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, verifier_id, credential_type)
);

-- Verification Logs (Audit Trail)
CREATE TABLE verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verifier_id UUID REFERENCES verifiers(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    credential_id UUID REFERENCES credentials(id) ON DELETE SET NULL,

    -- Verification Details
    verification_type VARCHAR(50) NOT NULL,
    verification_method VARCHAR(50) DEFAULT 'api' CHECK (verification_method IN ('api', 'portal', 'manual')),

    -- Result
    result VARCHAR(20) NOT NULL CHECK (result IN ('success', 'failure', 'error')),
    result_details JSONB,

    -- Blockchain Verification
    blockchain_verified BOOLEAN DEFAULT FALSE,
    blockchain_hash_matched BOOLEAN,

    -- Request Info
    ip_address VARCHAR(50),
    user_agent TEXT,

    -- Metadata
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_is_active ON admins(is_active);
CREATE INDEX idx_system_settings_updated_at ON system_settings(updated_at);
CREATE INDEX idx_institutions_email ON institutions(email);
CREATE INDEX idx_institutions_type ON institutions(type);
CREATE INDEX idx_institutions_status ON institutions(verification_status);
CREATE INDEX idx_verifiers_email ON verifiers(email);
CREATE INDEX idx_verifiers_status ON verifiers(verification_status);
CREATE INDEX idx_credentials_user_id ON credentials(user_id);
CREATE INDEX idx_credentials_institution_id ON credentials(institution_id);
CREATE INDEX idx_credentials_type ON credentials(credential_type);
CREATE INDEX idx_credentials_status ON credentials(status);
CREATE INDEX idx_credentials_did ON credentials(did);
CREATE INDEX idx_credentials_blockchain_hash ON credentials(blockchain_hash);
CREATE INDEX idx_consent_user_id ON consent_records(user_id);
CREATE INDEX idx_consent_verifier_id ON consent_records(verifier_id);
CREATE INDEX idx_consent_credential_id ON consent_records(credential_id);
CREATE INDEX idx_consent_status ON consent_records(status);
CREATE INDEX idx_consent_tiers_user_id ON consent_tiers(user_id);
CREATE INDEX idx_consent_tiers_verifier_id ON consent_tiers(verifier_id);
CREATE INDEX idx_consent_tiers_credential_type ON consent_tiers(credential_type);
CREATE INDEX idx_consent_tiers_status ON consent_tiers(status);
CREATE INDEX idx_verification_logs_verifier_id ON verification_logs(verifier_id);
CREATE INDEX idx_verification_logs_user_id ON verification_logs(user_id);
CREATE INDEX idx_verification_logs_credential_id ON verification_logs(credential_id);
CREATE INDEX idx_verification_logs_verified_at ON verification_logs(verified_at);

-- Triggers for Updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verifiers_updated_at BEFORE UPDATE ON verifiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consent_updated_at BEFORE UPDATE ON consent_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consent_tiers_updated_at BEFORE UPDATE ON consent_tiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data (Optional - for testing)
-- You can uncomment these to insert test data

-- INSERT INTO users (email, password_hash, first_name, last_name, kyc_status) VALUES
-- ('john.doe@example.com', '$2a$10$examplehash', 'John', 'Doe', 'approved');

-- INSERT INTO institutions (name, type, email, password_hash, verification_status) VALUES
-- ('MIT', 'education', 'admin@mit.edu', '$2a$10$examplehash', 'approved');

-- INSERT INTO verifiers (company_name, email, password_hash, verification_status) VALUES
-- ('Google Inc', 'verify@google.com', '$2a$10$examplehash', 'approved');

-- INSERT INTO admins (email, password_hash, full_name, role) VALUES
-- ('admin@trustvault.io', '$2a$10$examplehash', 'TrustVault Super Admin', 'super_admin');
