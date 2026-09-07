import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './db-wake.js';

// Prefer the current Supabase integration variables. Keep the legacy
// service-role variables as a fallback for older Vercel environments.
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase server configuration is missing. Set SUPABASE_URL and SUPABASE_SECRET_KEY in Vercel.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    fetch: async (url, options) => {
      const res = await fetch(url, options);
      if (!res.ok && res.status >= 500) triggerRestore();
      return res;
    },
  },
});

export default supabase;
