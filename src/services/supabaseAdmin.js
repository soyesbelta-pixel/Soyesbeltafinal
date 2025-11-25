import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Admin Supabase client with SERVICE_ROLE_KEY (Singleton Pattern)
 * ⚠️ WARNING: This bypasses RLS policies - use ONLY for admin operations
 * Never expose this client to frontend/public code
 *
 * Uses singleton pattern to prevent multiple client instances during HMR (Hot Module Replacement)
 */
let supabaseAdminInstance = null;

export const getSupabaseAdmin = () => {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
        storageKey: 'supabase-admin-auth'
      }
    });
  }
  return supabaseAdminInstance;
};

// For backward compatibility - lazily initialize on first access
export const supabaseAdmin = getSupabaseAdmin();
