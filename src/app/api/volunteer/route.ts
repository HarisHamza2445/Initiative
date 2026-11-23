import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';
import { validateVolunteer, type VolunteerFields } from '@/lib/volunteer';
import { sendAdminEmail, esc } from '@/lib/email';

export const runtime = 'nodejs';

const str = (v: unknown, max = 4000) => (typeof v === 'string' ? v.slice(0, max) : '');
const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 30).map((x) => x.slice(0, 200)) : []);

export async function POST(req: Request) {
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: 'Applications are not being accepted right now.' }, { status: 503 });

  if (Number(req.headers.get('content-length') || 0) > 2_000_000) return NextResponse.json({ error: 'Too large' }, { status: 413 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  const f: VolunteerFields = {
    name: str(body.name, 200).trim(), email: str(body.email, 200).trim(), phone: str(body.phone, 40).trim(), city: str(body.city, 200).trim(),
    interests: strs(body.interests), skills: str(body.skills).trim(), availability: strs(body.availability), why: str(body.why).trim(), extra: str(body.extra).trim()
  };
  const errs = validateVolunteer(f);
  if (Object.keys(errs).length) return NextResponse.json({ error: 'Invalid fields', fields: errs }, { status: 422 });

  const consent = (body.consent || {}) as Record<string, unknown>;
  const sig = (body.signature || {}) as Record<string, unknown>;
  if (consent.agreed !== true) return NextResponse.json({ error: 'Consent is required' }, { status: 422 });
  const method = sig.method === 'type' ? 'type' : sig.method === 'draw' ? 'draw' : null;
  const m = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(str(sig.image, 1_500_000));
  if (!method || !m) return NextResponse.json({ error: 'Signature is required' }, { status: 422 });
  const png = Buffer.from(m[1], 'base64');
  if (png.length < 100 || png.subarray(1, 4).toString() !== 'PNG') return NextResponse.json({ error: 'Invalid signature image' }, { status: 422 });

  const id = 'VOL-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
  const signedAtIn = new Date(str(sig.signedAt, 40));
  const now = new Date();
  // Trust the client's signing time only if it's plausible; otherwise use server time.
  const signedAt = !isNaN(+signedAtIn) && Math.abs(+now - +signedAtIn) < 3_600_000 ? signedAtIn : now;
  const path = `${now.toISOString().slice(0, 7)}/${id}.png`;

  const upl = await sb.storage.from('signatures').upload(path, png, { contentType: 'image/png', upsert: false });
  if (upl.error) { console.error('[volunteer] signature upload', upl.error); return NextResponse.json({ error: 'Could not save' }, { status: 500 }); }

  const row = {
    id, ...f,
    consent_agreed: true, consent_text: str(consent.text), terms: strs(consent.terms),
    signature_method: method, signature_typed_name: method === 'type' ? str(sig.typedName, 200) : '',
    signature_path: path, signed_at: signedAt.toISOString(), submitted_at: now.toISOString()
  };
  const ins = await sb.from('volunteer_applications').insert(row);
  if (ins.error) {
    console.error('[volunteer] insert', ins.error);
    await sb.storage.from('signatures').remove([path]);
    return NextResponse.json({ error: 'Could not save' }, { status: 500 });
  }

  const li = (k: string, v: string) => `<tr><td style="padding:6px 12px 6px 0;color:#5E6478;vertical-align:top">${k}</td><td style="padding:6px 0">${esc(v) || '—'}</td></tr>`;
  const sent = await sendAdminEmail({
    subject: `New volunteer application — ${f.name} (${id})`,
    replyTo: f.email,
    html: `<div style="font-family:Arial,sans-serif;color:#1B2A4A"><h2>New volunteer application</h2><table>${[
      li('ID', id), li('Name', f.name), li('Email', f.email), li('Phone', f.phone), li('City', f.city),
      li('Interests', f.interests.join(', ')), li('Availability', f.availability.join(', ')), li('Skills', f.skills), li('Why', f.why), li('Additional', f.extra),
      li('Signed', `${signedAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST (${method === 'draw' ? 'drawn' : 'typed: ' + row.signature_typed_name})`), li('Consent', 'Agreed to the volunteer terms')
    ].join('')}</table><p style="color:#5E6478;font-size:13px">The signature is attached and stored with the application in Supabase.</p></div>`,
    attachments: [{ filename: `${id}-signature.png`, content: m[1] }]
  });
  if (sent) await sb.from('volunteer_applications').update({ email_sent: true }).eq('id', id);

  return NextResponse.json({ id, signedAt: row.signed_at, submittedAt: row.submitted_at });
}
