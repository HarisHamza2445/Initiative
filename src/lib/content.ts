import 'server-only';
import { cache } from 'react';
import { SITE, type Site } from './site-defaults';
import { normalizeSite } from './merge';
import { getPublicSupabase } from './supabase/server';

/** Live site content: the saved row in `site_content` merged over the built-in defaults. */
export const getSite = cache(async (): Promise<Site> => {
  const sb = getPublicSupabase();
  if (!sb) return normalizeSite(SITE);
  try {
    const { data, error } = await sb.from('site_content').select('data').eq('id', 'main').maybeSingle();
    if (error) throw error;
    return normalizeSite(data?.data ?? {});
  } catch (e) {
    console.error('[content] falling back to defaults:', e);
    return normalizeSite(SITE);
  }
});
