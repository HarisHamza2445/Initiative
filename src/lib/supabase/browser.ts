'use client';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, hasSupabase } from './env';

let client: SupabaseClient | null = null;

/** Browser client (anon key + the admin's own session). Returns null when Supabase isn't configured. */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  return client;
}
