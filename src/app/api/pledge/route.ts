import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';
import { getSite } from '@/lib/content';

export const runtime = 'nodejs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Records a donation pledge. Status is always "awaiting_verification" — this never means money was received. */
export async function POST(req: Request) {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  const amount = Math.round(Number(b.amount));
  if (!Number.isFinite(amount) || amount < 1 || amount > 10_000_000) return NextResponse.json({ error: 'Invalid amount' }, { status: 422 });
  const site = await getSite();
  const purpose = typeof b.purpose === 'string' ? b.purpose : '';
  if (!site.donation.purposes.includes(purpose)) return NextResponse.json({ error: 'Invalid purpose' }, { status: 422 });
  const purposeOther = purpose === 'Other' && typeof b.purposeOther === 'string' ? b.purposeOther.trim().slice(0, 300) : '';
  if (purpose === 'Other' && !purposeOther) return NextResponse.json({ error: 'Purpose required' }, { status: 422 });
  const donorName = typeof b.name === 'string' ? b.name.trim().slice(0, 120) : '';
  const row = { amount, currency: site.donation.currency, purpose, purpose_other: purposeOther, donor_name: donorName };

  // Donor went back and changed their choice: update the pledge they just made instead of creating a duplicate.
  if (typeof b.replaces === 'string' && UUID.test(b.replaces)) {
    const since = new Date(Date.now() - 3_600_000).toISOString();
    const { data } = await sb.from('pledges').update({ ...row, updated_at: new Date().toISOString() })
      .eq('id', b.replaces).eq('status', 'awaiting_verification').gte('created_at', since).select('id').maybeSingle();
    if (data) return NextResponse.json({ id: data.id, status: 'awaiting_verification' });
  }

  const { data, error } = await sb.from('pledges').insert(row).select('id').single();
  if (error) { console.error('[pledge] insert', error); return NextResponse.json({ error: 'Could not save' }, { status: 500 }); }
  return NextResponse.json({ id: data.id, status: 'awaiting_verification' });
}
