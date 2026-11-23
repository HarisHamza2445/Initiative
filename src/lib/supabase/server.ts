import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/** Public read client used to render pages. Fetches are cached and tagged so admin saves can revalidate. */
export function getPublicSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, next: { tags: ['site'], revalidate: 3600 } }) }
  });
}

/** Service-role client: bypasses RLS. Only ever used in route handlers. */
export function getServiceSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SERVICE_KEY) return null;
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Verify a bearer token belongs to a user listed in `admins`. */
export async function requireAdmin(req: Request): Promise<{ ok: true; userId: string } | { ok: false; status: number; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, status: 503, error: 'Backend not configured' };
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return { ok: false, status: 401, error: 'Not signed in' };
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) return { ok: false, status: 401, error: 'Not signed in' };
  const { data: row } = await sb.from('admins').select('user_id').eq('user_id', data.user.id).maybeSingle();
  if (!row) return { ok: false, status: 403, error: 'Admin only' };
  return { ok: true, userId: data.user.id };
}
