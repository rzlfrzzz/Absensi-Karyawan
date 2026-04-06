// File untuk debug Supabase connection
// Jalankan di browser console: copy-paste kode ini

const debugSupabase = async () => {
  try {
    console.log('🔍 Debugging Supabase Connection...');

    // 1. Check environment variables
    console.log('📋 Environment Variables:');
    console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

    // 2. Import service
    const { attendanceService } = await import('./src/services/attendanceService');

    // 3. Try to fetch settings
    console.log('\n🔄 Testing Supabase Connection...');
    const settings = await attendanceService.getSettings();

    if (settings) {
      console.log('✅ Supabase Connected!');
      console.log('📊 Settings:', settings);
    } else {
      console.log('❌ Failed to fetch settings');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Run the debug
debugSupabase();
