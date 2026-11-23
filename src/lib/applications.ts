import 'server-only';
import { getServiceSupabase } from './supabase/server';

export type ApplicationRow = {
  id: string; name: string; email: string; phone: string; city: string;
  interests: string[]; availability: string[]; skills: string; why: string; extra: string;
  consent_agreed: boolean; consent_text: string; terms: string[];
  signature_method: 'draw' | 'type'; signature_typed_name: string; signature_path: string;
  signed_at: string; submitted_at: string; email_sent: boolean;
};

/** Load one application and its signature PNG with the service role (call only after requireAdmin). */
export async function loadApplication(id: string): Promise<{ row: ApplicationRow; png: Uint8Array | null } | null> {
  const sb = getServiceSupabase();
  if (!sb || !/^VOL-[A-Z0-9]+$/.test(id)) return null;
  const { data: row } = await sb.from('volunteer_applications').select('*').eq('id', id).maybeSingle();
  if (!row) return null;
  const { data: file } = await sb.storage.from('signatures').download(row.signature_path);
  return { row: row as ApplicationRow, png: file ? new Uint8Array(await file.arrayBuffer()) : null };
}
