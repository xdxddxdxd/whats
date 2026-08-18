import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rpompnqoobdqirctctno.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb21wbnFvb2JkcWlyY3RjdG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDIxMjQsImV4cCI6MjEwMjYxODEyNH0.so4LClA7hY_I44YrhzYEHwgUTyPp4opPUwnTM6TFrQE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  }
});
