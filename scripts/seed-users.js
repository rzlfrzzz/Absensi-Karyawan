#!/usr/bin/env node

/**
 * Seed Script - Create Initial Super Admin User
 * 
 * Usage: node scripts/seed-users.js
 * 
 * This script will:
 * 1. Generate bcryptjs password hashes
 * 2. Show SQL commands ready to run in Supabase
 * 3. Save credentials to secure location (for first login)
 */

import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================
// SEED DATA
// ============================================

const seedUsers = [
  {
    email: 'admin@absensi.com',
    password: 'Admin@123456',
    nama_lengkap: 'Super Administrator',
    role: 'super_admin',
  },
  {
    email: 'hr@absensi.com',
    password: 'HR@123456',
    nama_lengkap: 'HR Administrator',
    role: 'hr_admin',
  },
  {
    email: 'manager@absensi.com',
    password: 'Manager@123456',
    nama_lengkap: 'Department Manager',
    role: 'manager',
  },
];

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
  console.log('🌱 Seeding Database - Creating Initial Users\n');
  console.log('=' . repeat(70));

  let sqlStatements = [];
  let credentialsOutput = [];

  // Generate hashes for each user
  for (const user of seedUsers) {
    try {
      const passwordHash = await bcrypt.hash(user.password, 10);

      const sql = `
INSERT INTO users (email, password_hash, nama_lengkap, role, active)
VALUES (
  '${user.email}',
  '${passwordHash}',
  '${user.nama_lengkap}',
  '${user.role}',
  true
) ON CONFLICT (email) DO NOTHING;`;

      sqlStatements.push(sql);

      credentialsOutput.push({
        email: user.email,
        password: user.password,
        role: user.role,
        nama_lengkap: user.nama_lengkap,
      });

      console.log(`✅ Generated hash for: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error generating hash for ${user.email}:`, error);
    }
  }

  // ============================================
  // DISPLAY SQL STATEMENTS
  // ============================================

  console.log('\n' + '=' . repeat(70));
  console.log('📋 SQL STATEMENTS TO RUN IN SUPABASE:\n');
  console.log(
    '⚠️  Go to: Supabase → SQL Editor → New Query → Copy & Paste below:\n'
  );

  const fullSQL = `-- Delete existing seed users (optional)
-- DELETE FROM users WHERE email IN ('admin@absensi.com', 'hr@absensi.com', 'manager@absensi.com');

-- Insert Super Admin, HR Admin, and Manager Users
${sqlStatements.join('\n')}

-- Verify Users Created
SELECT id, email, nama_lengkap, role, active, created_at FROM users 
WHERE role IN ('super_admin', 'hr_admin', 'manager')
ORDER BY created_at DESC;`;

  console.log(fullSQL);

  // ============================================
  // SAVE CREDENTIALS TO FILE
  // ============================================

  console.log('\n' + '=' . repeat(70));
  console.log('🔐 CREDENTIALS FOR FIRST LOGIN:\n');

  const credentialsContent = `# ABSENSI SYSTEM - INITIAL CREDENTIALS
# ⚠️  KEEP THIS FILE SECURE AND DELETE AFTER FIRST LOGIN
# ⚠️  Change passwords immediately in production!

Generated: ${new Date().toISOString()}

${credentialsOutput
  .map(
    (cred) => `
## ${cred.role.toUpperCase()} - ${cred.nama_lengkap}
Email:    ${cred.email}
Password: ${cred.password}
Role:     ${cred.role}
`
  )
  .join('\n')}

---

## NEXT STEPS:

1. Copy the SQL statements above
2. Go to Supabase Dashboard → SQL Editor
3. Create New Query and paste the SQL
4. Run the query
5. Use above credentials to login
6. Change password immediately after login
7. Delete this credentials file
`;

  // Save to file
  const credentialsPath = path.join(
    process.cwd(),
    'INITIAL_CREDENTIALS.txt'
  );
  fs.writeFileSync(credentialsPath, credentialsContent);

  console.log(credentialsOutput
    .map(
      (cred) => `
📧 ${cred.email}
   🔑 ${cred.password}
   👤 ${cred.role}
`
    )
    .join('\n'));

  console.log(`\n✅ Credentials saved to: ${credentialsPath}`);

  // ============================================
  // FINAL INSTRUCTIONS
  // ============================================

  console.log('\n' + '=' . repeat(70));
  console.log('📝 INSTRUCTIONS:\n');
  console.log('1. Open file: INITIAL_CREDENTIALS.txt');
  console.log('2. Go to Supabase Dashboard');
  console.log('3. Open SQL Editor');
  console.log('4. Create New Query');
  console.log('5. Copy & paste SQL statements from above');
  console.log('6. Click Run');
  console.log('7. Wait for success');
  console.log('8. Go to http://localhost:3000/login');
  console.log('9. Use credentials from INITIAL_CREDENTIALS.txt');
  console.log('10. Login and change password immediately');
  console.log('11. Delete INITIAL_CREDENTIALS.txt file\n');

  console.log('=' . repeat(70));
  console.log('✨ Seed script completed!\n');
}

// ============================================
// RUN
// ============================================

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
