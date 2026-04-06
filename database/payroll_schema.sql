-- PHASE 5 & 6: Payroll & User Management Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- UPDATE: users table (add roles & relationships)
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'employee' 
  CHECK (role IN ('super_admin', 'hr_admin', 'manager', 'employee'));

ALTER TABLE users ADD COLUMN IF NOT EXISTS karyawan_id UUID REFERENCES karyawan(id) ON DELETE SET NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- UPDATE: karyawan table (add payment preferences)
-- ============================================
ALTER TABLE karyawan ADD COLUMN IF NOT EXISTS frequency_preference VARCHAR(50) DEFAULT 'monthly'
  CHECK (frequency_preference IN ('weekly', 'bi_weekly', 'monthly'));

ALTER TABLE karyawan ADD COLUMN IF NOT EXISTS primary_payment_method VARCHAR(50);

-- ============================================
-- 1. TABLE: payment_methods
-- ============================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('bank_transfer', 'cash', 'check', 'other')),
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. TABLE: karyawan_payment_info
-- ============================================
CREATE TABLE IF NOT EXISTS karyawan_payment_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  karyawan_id UUID NOT NULL REFERENCES karyawan(id) ON DELETE CASCADE,
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE RESTRICT,
  bank_name VARCHAR(100),
  account_number VARCHAR(100),
  account_holder VARCHAR(255),
  notes TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(karyawan_id, payment_method_id)
);

-- ============================================
-- 3. TABLE: tax_settings
-- ============================================
CREATE TABLE IF NOT EXISTS tax_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  pph21_nontaxable INTEGER DEFAULT 5000000,
  tax_brackets JSONB DEFAULT '[
    {"min": 0, "max": 50000000, "rate": 0.05},
    {"min": 50000001, "max": 250000000, "rate": 0.15},
    {"min": 250000001, "max": 500000000, "rate": 0.25},
    {"min": 500000001, "max": null, "rate": 0.30}
  ]',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. TABLE: payroll_records (Main)
-- ============================================
CREATE TABLE IF NOT EXISTS payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  karyawan_id UUID NOT NULL REFERENCES karyawan(id) ON DELETE CASCADE,
  periode_start DATE NOT NULL,
  periode_end DATE NOT NULL,
  frequency_type VARCHAR(50) NOT NULL CHECK (frequency_type IN ('weekly', 'bi_weekly', 'monthly')),

  -- Base Salary
  gaji_pokok INTEGER NOT NULL,

  -- Bonuses
  bonus_on_time INTEGER DEFAULT 0,
  bonus_early_checkout INTEGER DEFAULT 0,
  bonus_other INTEGER DEFAULT 0,

  -- Deductions (will be detailed in payroll_deductions table)
  total_deductions INTEGER DEFAULT 0,
  tax_pph21 INTEGER DEFAULT 0,
  custom_deductions INTEGER DEFAULT 0,

  -- Final Amount
  total_gaji INTEGER NOT NULL,

  -- Status & Approval
  status VARCHAR(50) NOT NULL DEFAULT 'draft' 
    CHECK (status IN ('draft', 'pending_approval', 'approved', 'paid', 'rejected')),
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMP,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP,

  -- Payment
  paid_by UUID REFERENCES users(id) ON DELETE SET NULL,
  paid_at TIMESTAMP,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  payment_reference VARCHAR(255),
  notes TEXT,

  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(karyawan_id, periode_start, periode_end)
);

-- ============================================
-- 5. TABLE: payroll_deductions (Detail Breakdown)
-- ============================================
CREATE TABLE IF NOT EXISTS payroll_deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID NOT NULL REFERENCES payroll_records(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('late', 'absent', 'custom', 'pph21', 'insurance', 'pension', 'loan')),
  description VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. TABLE: payroll_approvals (Workflow)
-- ============================================
CREATE TABLE IF NOT EXISTS payroll_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID NOT NULL REFERENCES payroll_records(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. TABLE: payroll_lock (Version Control)
-- ============================================
CREATE TABLE IF NOT EXISTS payroll_lock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulan VARCHAR(7) NOT NULL UNIQUE,
  locked BOOLEAN DEFAULT FALSE,
  locked_at TIMESTAMP,
  locked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. TABLE: payroll_payment_record (Payment Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS payroll_payment_record (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID NOT NULL REFERENCES payroll_records(id) ON DELETE CASCADE,
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE RESTRICT,
  amount_paid INTEGER NOT NULL,
  payment_date DATE NOT NULL,
  paid_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  reference_number VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'completed', 'failed')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_payroll_karyawan_id ON payroll_records(karyawan_id);
CREATE INDEX IF NOT EXISTS idx_payroll_periode ON payroll_records(periode_start, periode_end);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON payroll_records(status);
CREATE INDEX IF NOT EXISTS idx_payroll_approval_payroll_id ON payroll_approvals(payroll_id);
CREATE INDEX IF NOT EXISTS idx_karyawan_payment_info ON karyawan_payment_info(karyawan_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_karyawan_id ON users(karyawan_id);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert payment methods
INSERT INTO payment_methods (name, type, description) VALUES
  ('Bank Transfer BCA', 'bank_transfer', 'Transfer ke rekening BCA'),
  ('Bank Transfer Mandiri', 'bank_transfer', 'Transfer ke rekening Mandiri'),
  ('Bank Transfer BRI', 'bank_transfer', 'Transfer ke rekening BRI'),
  ('Cash Payment', 'cash', 'Pembayaran tunai'),
  ('Check Payment', 'check', 'Pembayaran dengan cek')
ON CONFLICT DO NOTHING;

-- Insert default tax settings
INSERT INTO tax_settings (name, pph21_nontaxable) VALUES
  ('Indonesia PPh21 2024', 5000000)
ON CONFLICT DO NOTHING;

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_payment_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE karyawan_payment_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_lock ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - For Development (Allow All)
-- In Production: Tighten based on roles
-- ============================================

-- Payroll Records Policies
CREATE POLICY "Payroll - Public read" ON payroll_records
  FOR SELECT USING (TRUE);

CREATE POLICY "Payroll - Public insert" ON payroll_records
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Payroll - Public update" ON payroll_records
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Payroll - Public delete" ON payroll_records
  FOR DELETE USING (TRUE);

-- Payroll Deductions Policies
CREATE POLICY "Payroll Deductions - Public access" ON payroll_deductions
  FOR SELECT USING (TRUE);

CREATE POLICY "Payroll Deductions - Public insert" ON payroll_deductions
  FOR INSERT WITH CHECK (TRUE);

-- Payroll Approvals Policies
CREATE POLICY "Payroll Approvals - Public access" ON payroll_approvals
  FOR SELECT USING (TRUE);

CREATE POLICY "Payroll Approvals - Public insert" ON payroll_approvals
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Payroll Approvals - Public update" ON payroll_approvals
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Payment Records Policies
CREATE POLICY "Payment Records - Public access" ON payroll_payment_record
  FOR SELECT USING (TRUE);

CREATE POLICY "Payment Records - Public insert" ON payroll_payment_record
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Payment Records - Public update" ON payroll_payment_record
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Payment Methods Policies
CREATE POLICY "Payment Methods - Public read" ON payment_methods
  FOR SELECT USING (TRUE);

CREATE POLICY "Payment Methods - Admin insert" ON payment_methods
  FOR INSERT WITH CHECK (TRUE);

-- Karyawan Payment Info Policies
CREATE POLICY "Karyawan Payment Info - Public access" ON karyawan_payment_info
  FOR SELECT USING (TRUE);

CREATE POLICY "Karyawan Payment Info - Public insert" ON karyawan_payment_info
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Karyawan Payment Info - Public update" ON karyawan_payment_info
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- Tax Settings Policies
CREATE POLICY "Tax Settings - Public read" ON tax_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Tax Settings - Admin manage" ON tax_settings
  FOR INSERT WITH CHECK (TRUE);

-- Payroll Lock Policies
CREATE POLICY "Payroll Lock - Public access" ON payroll_lock
  FOR SELECT USING (TRUE);

CREATE POLICY "Payroll Lock - Admin manage" ON payroll_lock
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Payroll Lock - Admin update" ON payroll_lock
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
