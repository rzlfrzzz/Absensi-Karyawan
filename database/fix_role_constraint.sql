-- FIX: Update users table role check constraint

-- Drop existing constraint (if it exists)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Re-create with correct values
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('super_admin', 'hr_admin', 'manager', 'employee'));

-- Verify constraint
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'users_role_check';
