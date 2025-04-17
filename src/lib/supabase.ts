import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://sylchabdkxrkkjxqnnbp.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bGNoYWJka3hya2tqeHFubmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTI0MTMsImV4cCI6MjA2MDI2ODQxM30.hICYUSTmmTY3dIF3Wy6htUaTzVxxFkZkDNtyR_in0J0";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
}); 