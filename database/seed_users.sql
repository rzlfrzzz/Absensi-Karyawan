-- PHASE 5 & 6: Seed Data - Create Initial Super Admin User
-- Run this in Supabase SQL Editor AFTER updating password hash manually

-- ============================================
-- BEFORE RUNNING THIS:
-- ============================================
-- 1. Generate password hash using this Node.js command:
--
--    node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password123', 10).then(h => console.log(h))"
--
--    Replace 'password123' with your desired password
--    Copy the output hash and paste it below
--
-- ============================================

-- Delete existing users (optional - untuk fresh start)
-- DELETE FROM users WHERE email LIKE '%@%';

-- Insert Super Admin User
-- Replace $2a$10$... with the actual bcryptjs hash
INSERT INTO users (
  email,
  password_hash,
  nama_lengkap,
  role,
  active
) VALUES (
  'admin@absensi.com',
  '$2a$10$YourBcryptHashHere', -- REPLACE THIS WITH ACTUAL HASH
  'Super Administrator',
  'super_admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert HR Admin User
INSERT INTO users (
  email,
  password_hash,
  nama_lengkap,
  role,
  active
) VALUES (
  'hr@absensi.com',
  '$2a$10$YourBcryptHashHere', -- REPLACE THIS WITH ACTUAL HASH
  'HR Administrator',
  'hr_admin',
  active
) ON CONFLICT (email) DO NOTHING;

-- Insert Sample Manager User
INSERT INTO users (
  email,
  password_hash,
  nama_lengkap,
  role,
  active
) VALUES (
  'manager@absensi.com',
  '$2a$10$YourBcryptHashHere', -- REPLACE THIS WITH ACTUAL HASH
  'Department Manager',
  'manager',
  true
) ON CONFLICT (email) DO NOTHING;

-- Verify inserted users
SELECT id, email, nama_lengkap, role, active FROM users ORDER BY created_at;
