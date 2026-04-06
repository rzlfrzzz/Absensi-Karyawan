# Git Configuration

## Files to Keep Private

Add this to your `.gitignore` if not already present:

```gitignore
# Environment Variables
.env.local
.env.*.local
.env.production.local

# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
*.pem
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo
*~
.env
```

## Important Notes

⚠️ **NEVER commit `.env.local`!**
- Contains your Supabase credentials
- If leaked, anyone can access your database
- `.env.example` is safe to commit (no real values)

✅ **Always use `.env.local`**
- Contains your real credentials
- Listed in `.gitignore` (won't be committed)
- Load at runtime only

## Safe Files to Commit

✅ These are safe to commit:
- `.env.example` - Template with no values
- `src/` - All source code
- Documentation files
- `vite.config.ts`
- `package.json`
- `tsconfig.json`

❌ These should NEVER be committed:
- `.env.local` - Real credentials
- `node_modules/` - Dependencies
- `/dist` - Build output
- IDE configuration (if sensitive)

## Workflow

```bash
# 1. Clone repository
git clone your-repo
cd your-project

# 2. Copy environment template
cp .env.example .env.local

# 3. Add your credentials
# Edit .env.local (editor of choice)

# 4. Install dependencies
npm install

# 5. Start development
npm run dev

# 6. Make changes and commit
git add .
git commit -m "Your message"
git push origin main
```

## For Team Members

When onboarding new team members:

1. Share `.env.example` (safe)
2. Share real `.env.local` through secure channel (Slack, email, etc.)
3. Tell them to:
   ```bash
   cp .env.example .env.local
   # Paste the credentials you provided
   npm install
   npm run dev
   ```

Never commit `.env.local` to Git!

## CI/CD Setup

For continuous integration, set environment variables through:

### GitHub Actions
```yaml
- name: Setup .env
  run: |
    echo "VITE_SUPABASE_URL=${{ secrets.VITE_SUPABASE_URL }}" >> .env.local
    echo "VITE_SUPABASE_ANON_KEY=${{ secrets.VITE_SUPABASE_ANON_KEY }}" >> .env.local
```

### Vercel/Netlify
- Set environment variables in dashboard
- CI/CD automatically loads them

### Local Development
- Use `.env.local` file
- Keep it private (in `.gitignore`)

---

✅ Your project is configured safely!
