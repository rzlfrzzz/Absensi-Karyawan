import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
console.log('🔧 Supabase Configuration:');
console.log('  URL:', supabaseUrl ? '✅ Set' : '❌ NOT SET');
console.log('  Key:', supabaseKey ? '✅ Set' : '❌ NOT SET');
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: Missing Supabase environment variables!');
    console.error('  Please check .env.local file');
    throw new Error('Missing Supabase environment variables. Please configure .env file.');
}
export const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase client initialized successfully');
