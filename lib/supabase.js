/**
 * Supabase Client Configuration
 * 
 * Initializes the Supabase JS client for database operations.
 * Used in API routes to persist assessment results and roadmaps.
 * 
 * Gracefully handles missing credentials — the app works without
 * a database connection, it just won't persist data between sessions.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase client instance.
 * Will be null if environment variables are not configured.
 */
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    '⚠️  Supabase credentials not found. Database persistence is disabled. ' +
    'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
  );
}

export { supabase };
