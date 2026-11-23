'use client';
/* eslint-disable @next/next/no-img-element */
import { createContext, useContext, useState, type ChangeEvent } from 'react';
import type { Site } from '@/lib/site-defaults';
import { Icon } from '@/components/ui/Icon';

export const getP = (o: unknown, p: string): unknown => p.split('.').reduce<unknown>((a, k) => (a == null ? a : (a as Record<string, unknown>)[k]), o);
export function setP<T>(o: T, p: string, v: unknown): T {
  const ks = p.split('.');
  const c = structuredClone(o) as Record<string, unknown>;
  let t = c;
  ks.slice(0, -1).forEach((k) => { if (t[k] == null) t[k] = {}; t = t[k] as Record<string, unknown>; });
  t[ks[ks.length - 1]] = v;
  return c as T;
}

export const AdCtx = createContext<{ d: Site; upd: (p: string, v: unknown) => void; upload: (f: File, folder?: string) => Promise<string> } | null>(null);
export const useAd = () => useContext(AdCtx)!;

export function T({ p, label, area, hint, type }: { p: string; label: string; area?: boolean; hint?: string; type?: string }) {
  const { d, upd } = useAd();
  const v = getP(d, p);
  return (
    <div className="fld"><label htmlFor={'ad-' + p}>{label}</label>
      {area
        ? <textarea id={'ad-' + p} value={String(v ?? '')} onChange={(e) => upd(p, e.target.value)}></textarea>
        : <input id={'ad-' + p} type={type || 'text'} value={String(v ?? '')} onChange={(e) => upd(p, type === 'number' ? Number(e.target.value) : e.target.value)} />}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function Lines({ p, label, hint }: { p: string; label: string; hint?: string }) {
  const { d, upd } = useAd();
  const v = (getP(d, p) as string[] | undefined) || [];
  return (
    <div className="fld"><label htmlFor={'ad-' + p}>{label}</label>
      <textarea id={'ad-' + p} value={v.join('\n')} onChange={(e) => upd(p, e.target.value.split('\n'))} onBlur={(e) => upd(p, e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))}></textarea>
      <span className="hint">{hint || 'One per line.'}</span>
    </div>
  );
}

export function ImgField({ label, value, onChange, round, folder }: { label: string; value: string; onChange: (v: string) => void; round?: boolean; folder?: string }) {
  const { upload } = useAd();
  const [busy, setBusy] = useState(false), [err, setErr] = useState('');
  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    setBusy(true); setErr('');
    try { onChange(await upload(f, folder)); } catch (x) { setErr((x as Error)?.message || 'Upload failed — try again.'); }
    setBusy(false);
  };
  return (
    <div className="ad-img">
      <span className="lbl">{label}</span>
      <div className="ad-img-row">
        <div className={'ad-prev' + (round ? ' round' : '')}>{value ? <img src={value} alt="" /> : <Icon d="image" s={22} />}</div>
        <label className="btn btn-wh btn-sm" style={{ cursor: 'pointer' }}>{busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}<input type="file" accept="image/*" onChange={pick} style={{ display: 'none' }} /></label>
        {value && <button type="button" className="btn btn-sm ad-x" onClick={() => onChange('')}>Remove</button>}
      </div>
      {err && <span className="ferr">{err}</span>}
    </div>
  );
}
