#!/bin/bash

# 🔍 DEBUG SCRIPT - Attendance Log Error

echo "🔍 Debugging Attendance Log Error..."
echo ""

# 1. Check .env.local exists
echo "✓ Checking .env.local..."
if [ -f .env.local ]; then
  echo "  ✅ .env.local exists"
  echo "  URL set: $(grep -q 'VITE_SUPABASE_URL' .env.local && echo '✅' || echo '❌')"
  echo "  Key set: $(grep -q 'VITE_SUPABASE_ANON_KEY' .env.local && echo '✅' || echo '❌')"
else
  echo "  ❌ .env.local NOT FOUND"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Open browser DevTools (F12)"
echo "2. Go to Console tab"
echo "3. Try PIN form again"
echo "4. Look for error messages:"
echo "   - 'relation logs_absensi does not exist' → Table not created"
echo "   - 'permission denied' → RLS policy issue"
echo "   - 'Invalid API Key' → Credentials wrong"
echo "5. Copy full error and share"
echo ""
