-- CERTISAFE SUPABASE SCHEMA (POSTGRESQL)
-- Run this in the Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Users Table (Auth Metadata)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'issuer', 'auditor', 'user')),
  org_secret VARCHAR(255), -- Stores secret for organization verification if needed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Certificates Table (The Immutable Ledger)
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  template_id UUID REFERENCES templates(id),
  institution_id UUID REFERENCES institutions(id),
  issue_date TIMESTAMPTZ DEFAULT NOW(),
  expiry_date TIMESTAMPTZ,
  qr_code TEXT,
  data_hash VARCHAR(64),
  status VARCHAR(20) DEFAULT 'valid' CHECK (status IN ('valid', 'revoked', 'expired')),
  revocation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  performed_by UUID REFERENCES profiles(id),
  target_id VARCHAR(36),
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Minimal setup for university project simplicity
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Allow direct access for service role (used by Next.js backend)
-- In a real production app, you'd add fine-grained policies here
CREATE POLICY "Allow all to service role" ON users FOR ALL USING (true);
CREATE POLICY "Allow all to service role" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all to service role" ON certificates FOR ALL USING (true);
CREATE POLICY "Allow all to service role" ON templates FOR ALL USING (true);
CREATE POLICY "Allow all to service role" ON institutions FOR ALL USING (true);
CREATE POLICY "Allow all to service role" ON audit_logs FOR ALL USING (true);
