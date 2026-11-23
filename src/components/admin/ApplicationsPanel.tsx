'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { telHref } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';

type Application = {
  id: string; name: string; email: string; phone: string; city: string;
  interests: string[]; availability: string[]; skills: string; why: string; extra: string;
  consent_agreed: boolean; signature_method: 'draw' | 'type'; signature_typed_name: string; signature_path: string;
  signed_at: string; submitted_at: string; email_sent: boolean;
};

const when = (d: string) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

/** Read-only list of signed volunteer applications, newest first. Only admins can read them (RLS). */
export function ApplicationsPanel({ sb }: { sb: SupabaseClient }) {
  const [rows, setRows] = useState<Application[] | null>(null);
  const [sigs, setSigs] = useState<Record<string, string>>({});
  const [err, setErr] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const token = async () => (await sb.auth.getSession()).data.session?.access_token ?? '';
  /** Fetch an admin-only file from our API (it checks the admin session, then reads the private bucket). */
  const adminFile = async (path: string) => {
    const r = await fetch(path, { headers: { authorization: `Bearer ${await token()}` } });
    if (!r.ok) throw new Error(String(r.status));
    return r.blob();
  };

  const load = async () => {
    setErr('');
    const { data, error } = await sb.from('volunteer_applications').select('*').order('submitted_at', { ascending: false });
    if (error) { setErr('Could not load applications. Check your connection and try again.'); setRows([]); return; }
    const list = data as Application[];
    setRows(list);
    const m: Record<string, string> = {};
    await Promise.all(list.map(async (a) => {
      try { m[a.id] = URL.createObjectURL(await adminFile(`/api/admin/applications/${a.id}/signature`)); } catch { /* shown as unavailable */ }
    }));
    setSigs((old) => { Object.values(old).forEach((u) => URL.revokeObjectURL(u)); return m; });
  };

  const [dl, setDl] = useState<string | null>(null);
  const download = async (a: Application) => {
    setDl(a.id); setErr('');
    try {
      const url = URL.createObjectURL(await adminFile(`/api/admin/applications/${a.id}/pdf`));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${a.id}-${a.name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'application'}.pdf`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      setErr('Could not download the PDF. Please try again.');
    }
    setDl(null);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!rows) return <p className="hint">Loading applications…</p>;
  return (
    <div className="stack">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <p className="hint" style={{ fontSize: '14px' }}>{rows.length === 0 ? 'No applications yet.' : `${rows.length} signed application${rows.length === 1 ? '' : 's'}, newest first.`}</p>
        <button type="button" className="btn btn-wh btn-sm" onClick={load}>Refresh</button>
      </div>
      {err && <span className="ferr" role="alert">{err}</span>}
      {rows.map((a) => {
        const isOpen = open === a.id;
        return (
          <div className="ad-card" key={a.id}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                <b style={{ fontSize: '18px', fontWeight: 700 }}>{a.name}</b>
                <span className="hint">{a.id} · {when(a.submitted_at)} · {a.city}</span>
              </div>
              <div className="ad-acts">
                <button type="button" className="btn btn-wh btn-sm" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : a.id)}>{isOpen ? 'Hide details' : 'View details'}</button>
                <button type="button" className="btn btn-or btn-sm" disabled={dl === a.id} onClick={() => download(a)}>{dl === a.id ? 'Preparing…' : 'Download PDF'}</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', fontSize: '15px' }}>
              <a href={'mailto:' + a.email} style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', fontWeight: 600 }}><Icon d="mail" s={16} />{a.email}</a>
              <a href={telHref(a.phone)} style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', fontWeight: 600 }}><Icon d="phone" s={16} />{a.phone}</a>
            </div>
            <div className="chips">{a.interests.map((x) => <span key={x} className="pillst">{x}</span>)}</div>
            {isOpen && (
              <div className="stack" style={{ gap: '14px' }}>
                <div className="sumry">
                  <div><span>Availability</span><b style={{ textAlign: 'right' }}>{a.availability.join(', ')}</b></div>
                  <div><span>Signed</span><b style={{ textAlign: 'right' }}>{when(a.signed_at)} ({a.signature_method === 'draw' ? 'drawn' : 'typed'})</b></div>
                  <div><span>Consent</span><b>{a.consent_agreed ? 'Agreed to the volunteer terms' : 'Not agreed'}</b></div>
                </div>
                <div className="fld"><span className="lbl">Skills and experience</span><p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>{a.skills}</p></div>
                <div className="fld"><span className="lbl">Why they want to volunteer</span><p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>{a.why}</p></div>
                {a.extra && <div className="fld"><span className="lbl">Additional information</span><p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>{a.extra}</p></div>}
                <div className="fld"><span className="lbl">Signature</span>{sigs[a.id] ? <img className="sigimg" src={sigs[a.id]} alt={'Signature of ' + a.name} /> : <span className="hint">Signature image unavailable — press Refresh.</span>}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
