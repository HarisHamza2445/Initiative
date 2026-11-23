'use client';
/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ChangeEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useSite } from '@/lib/site-context';
import { DEFAULT_LOGO, type GalleryItem, type Site, type Update } from '@/lib/site-defaults';
import { uploadImg } from '@/lib/uploads';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { AdCtx, ImgField, Lines, T, getP, setP } from './fields';
import { ApplicationsPanel } from './ApplicationsPanel';

const TABS = [['applications', 'Volunteer applications'], ['home', 'Home & About'], ['founder', 'About me'], ['story', 'Our story'], ['impact', 'Impact'], ['gallery', 'Gallery'], ['updates', 'Updates'], ['donate', 'Donation'], ['volunteer', 'Volunteer form'], ['contact', 'Contact & site']] as const;
type Tab = (typeof TABS)[number][0];
type State = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export function AdminEditor({ sb, onSignOut }: { sb: SupabaseClient; onSignOut: () => void }) {
  const site = useSite();
  const router = useRouter();
  const [d, setD] = useState<Site>(() => structuredClone(site));
  const [tab, setTab] = useState<Tab>('applications');
  const [state, setState] = useState<State>('idle');
  const [msg, setMsg] = useState('');
  const upd = (p: string, v: unknown) => { setD((o) => setP(o, p, v)); setState('dirty'); };
  const arr = <X,>(p: string) => ((getP(d, p) as X[] | undefined) || []);
  const move = (p: string, i: number, dir: number) => { const a = arr(p).slice(); const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; upd(p, a); };
  const [pend, setPend] = useState<number | null>(null);
  const confirmDel = (i: number) => { if (pend === i) { setPend(null); return true; } setPend(i); setTimeout(() => setPend(null), 3000); return false; };
  const del = (p: string, i: number) => { if (!confirmDel(i)) return; const a = arr(p).slice(); a.splice(i, 1); upd(p, a); };
  const upload = (f: File, folder?: string) => uploadImg(sb, f, folder);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (state !== 'dirty') return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    addEventListener('beforeunload', h);
    return () => removeEventListener('beforeunload', h);
  }, [state]);

  const save = async () => {
    setState('saving'); setMsg('');
    try {
      const { data: u } = await sb.auth.getUser();
      const { error } = await sb.from('site_content').upsert({ id: 'main', data: structuredClone(d), updated_at: new Date().toISOString(), updated_by: u.user?.id ?? null });
      if (error) throw error;
      const { data: s } = await sb.auth.getSession();
      await fetch('/api/revalidate', { method: 'POST', headers: { authorization: `Bearer ${s.session?.access_token ?? ''}` } });
      setState('saved');
      router.refresh();
    } catch (e) {
      console.error(e);
      setState('error');
      setMsg('Could not save. Check your connection and try again.');
    }
  };
  useEffect(() => { if (state === 'saved') { const t = setTimeout(() => setState('idle'), 2500); return () => clearTimeout(t); } }, [state]);

  const addGallery = async (e: ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files || []); e.target.value = '';
    if (!fs.length) return;
    setMsg('Uploading ' + fs.length + ' photo(s)…');
    const out: GalleryItem[] = [];
    let failed = false;
    for (const f of fs) { try { out.push({ src: await upload(f, 'gallery'), category: 'Community', caption: '', description: '' }); } catch { failed = true; } }
    setD((o) => setP(o, 'gallery', [...out, ...o.gallery])); setState('dirty');
    setMsg(failed ? 'Some photos could not be uploaded.' : '');
  };

  const panels: Record<Tab, React.ReactNode> = {
    applications: <ApplicationsPanel sb={sb} />,
    home: <div className="stack"><T p="announcement" label="Announcement bar" hint="Leave empty to hide the bar." /><T p="intro" label="Introduction (About us)" area /><T p="vision" label="Our vision" area /><T p="mission" label="Our mission" area /><T p="role" label="Our role & purpose" area /></div>,
    founder: <div className="stack"><ImgField label="Founder photo (optional — the logo shows if empty)" value={d.founder.photo} folder="founder" onChange={(v) => upd('founder.photo', v)} /><div className="two"><T p="founder.name" label="Name" /><T p="founder.title" label="Title" /></div><T p="founder.intro" label="Opening paragraph" area /><Lines p="founder.points" label="Key points" hint="One point per line." /><T p="founder.quote" label="Highlighted quote" area /><T p="founder.promise" label="Promise line" area /><T p="founder.signoff" label="Sign-off" /></div>,
    story: <div className="stack"><T p="story.heading" label="Heading" /><T p="story.named" label="Named after" area /><T p="story.extra" label="The extra “aa”" area />
      <span className="lbl">Values</span>{arr<[string, string]>('story.values').map((v, i) => (
        <div className="two" key={i}>
          <div className="fld"><input aria-label={'Value ' + (i + 1) + ' title'} value={v[0]} onChange={(e) => { const a = arr<[string, string]>('story.values').map((x) => [...x] as [string, string]); a[i][0] = e.target.value; upd('story.values', a); }} /></div>
          <div className="fld"><input aria-label={'Value ' + (i + 1) + ' text'} value={v[1]} onChange={(e) => { const a = arr<[string, string]>('story.values').map((x) => [...x] as [string, string]); a[i][1] = e.target.value; upd('story.values', a); }} /></div>
        </div>
      ))}
      <T p="story.closing" label="Closing line" area /></div>,
    impact: <div className="stack"><div className="two"><T p="impact.value" label="Number" type="number" hint="Only verified numbers." /><T p="impact.suffix" label="Suffix" hint="e.g. +" /></div><T p="impact.label" label="Label" /></div>,
    gallery: <div className="stack">
      <label className="btn btn-or" style={{ alignSelf: 'flex-start', cursor: 'pointer' }}>+ Add photos<input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={addGallery} /></label>
      {msg && state !== 'error' && <p className="hint">{msg}</p>}
      {arr<GalleryItem>('gallery').map((g, i) => {
        const setG = (k: keyof GalleryItem, v: string) => { const a = arr<GalleryItem>('gallery').slice(); a[i] = { ...g, [k]: v }; upd('gallery', a); };
        return (
          <div className="ad-item" key={g.src + i}>
            <div className="ad-prev big">{g.src ? <img src={g.src} alt="" /> : <Icon d="image" s={22} />}</div>
            <div className="stack" style={{ gap: '10px', flex: 1, minWidth: 0 }}>
              <div className="two"><div className="fld"><label htmlFor={'gc' + i}>Caption</label><input id={'gc' + i} value={g.caption} onChange={(e) => setG('caption', e.target.value)} /></div>
                <div className="fld"><label htmlFor={'gk' + i}>Category</label><input id={'gk' + i} value={g.category} onChange={(e) => setG('category', e.target.value)} /></div></div>
              <div className="fld"><label htmlFor={'gd' + i}>Description</label><input id={'gd' + i} value={g.description} onChange={(e) => setG('description', e.target.value)} /></div>
              <div className="ad-acts"><button type="button" className="btn btn-wh btn-sm" onClick={() => move('gallery', i, -1)} disabled={i === 0}>↑ Up</button><button type="button" className="btn btn-wh btn-sm" onClick={() => move('gallery', i, 1)}>↓ Down</button><button type="button" className="btn btn-sm ad-x" onClick={() => del('gallery', i)}>{pend === i ? 'Tap again to remove' : 'Remove'}</button></div>
            </div>
          </div>
        );
      })}
    </div>,
    updates: <div className="stack">
      <button type="button" className="btn btn-or" style={{ alignSelf: 'flex-start' }} onClick={() => upd('updates', [{ id: 'u' + Date.now(), title: 'New update', date: new Date().toISOString().slice(0, 10), category: '', location: '', summary: '', amount: '', breakdown: [], photos: [] }, ...arr<Update>('updates')])}>+ New update</button>
      {arr<Update>('updates').map((u, i) => {
        const set = (k: keyof Update, v: unknown) => setD((o) => { const a = o.updates.slice(); a[i] = { ...a[i], [k]: v }; setState('dirty'); return { ...o, updates: a }; });
        const addPhotos = async (e: ChangeEvent<HTMLInputElement>) => {
          const fs = Array.from(e.target.files || []); e.target.value = '';
          const out: string[] = [];
          for (const f of fs) { try { out.push(await upload(f, 'updates')); } catch { /* skip */ } }
          setD((o) => { const a = o.updates.slice(); a[i] = { ...a[i], photos: [...(a[i].photos || []), ...out] }; return { ...o, updates: a }; }); setState('dirty');
        };
        return (
          <div className="ad-card" key={u.id || i}>
            <div className="two"><div className="fld"><label htmlFor={'ut' + i}>Title</label><input id={'ut' + i} value={u.title} onChange={(e) => set('title', e.target.value)} /></div><div className="fld"><label htmlFor={'ud' + i}>Date</label><input id={'ud' + i} type="date" value={u.date} onChange={(e) => set('date', e.target.value)} /></div></div>
            <div className="two"><div className="fld"><label htmlFor={'uc' + i}>Category</label><input id={'uc' + i} value={u.category} onChange={(e) => set('category', e.target.value)} placeholder="Education, Food, Festivals…" /></div><div className="fld"><label htmlFor={'ul' + i}>Location</label><input id={'ul' + i} value={u.location} onChange={(e) => set('location', e.target.value)} /></div></div>
            <div className="fld"><label htmlFor={'us' + i}>What happened</label><textarea id={'us' + i} value={u.summary} onChange={(e) => set('summary', e.target.value)}></textarea></div>
            <div className="fld"><label htmlFor={'ua' + i}>Total funds used ({d.donation.currency})</label><input id={'ua' + i} inputMode="numeric" value={u.amount} onChange={(e) => set('amount', e.target.value.replace(/[^0-9.]/g, ''))} placeholder="Leave empty until verified" /></div>
            <span className="lbl">Where the money went</span>
            {(u.breakdown || []).map((r, j) => (
              <div className="ad-row" key={j}>
                <input aria-label="Item" value={r.item} placeholder="e.g. 50 notebooks" onChange={(e) => { const b = u.breakdown.slice(); b[j] = { ...r, item: e.target.value }; set('breakdown', b); }} />
                <input aria-label="Amount" inputMode="numeric" value={r.amount} placeholder="Amount" onChange={(e) => { const b = u.breakdown.slice(); b[j] = { ...r, amount: e.target.value.replace(/[^0-9.]/g, '') }; set('breakdown', b); }} />
                <button type="button" className="btn btn-sm ad-x" aria-label="Remove line" onClick={() => { const b = u.breakdown.slice(); b.splice(j, 1); set('breakdown', b); }}>×</button>
              </div>
            ))}
            <button type="button" className="btn btn-wh btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => set('breakdown', [...(u.breakdown || []), { item: '', amount: '' }])}>+ Add line</button>
            <span className="lbl">Photos</span>
            <div className="ad-thumbs">{(u.photos || []).map((src, j) => (
              <div className="ad-th" key={src + j}><img src={src} alt="" /><button type="button" aria-label="Remove photo" onClick={() => { const p = u.photos.slice(); p.splice(j, 1); set('photos', p); }}>×</button></div>
            ))}
              <label className="ad-th add" style={{ cursor: 'pointer' }}>+<input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={addPhotos} /></label></div>
            <div className="ad-acts"><button type="button" className="btn btn-wh btn-sm" onClick={() => move('updates', i, -1)} disabled={i === 0}>↑ Up</button><button type="button" className="btn btn-wh btn-sm" onClick={() => move('updates', i, 1)}>↓ Down</button><button type="button" className="btn btn-sm ad-x" onClick={() => del('updates', i)}>{pend === i ? 'Tap again to delete' : 'Delete update'}</button></div>
          </div>
        );
      })}
    </div>,
    donate: <div className="stack"><ImgField label="Donation QR code" value={d.donation.qrImage} folder="donation" onChange={(v) => upd('donation.qrImage', v)} /><div className="two"><T p="donation.upiId" label="UPI ID" /><T p="donation.payee" label="Payee name" /></div><T p="donation.intro" label="Introduction" area /><Lines p="donation.purposes" label="Donation purposes" hint="One per line. Keep “Other” last." />
      <div className="fld"><label htmlFor="ad-amts">Amount options</label><AmountsInput value={d.donation.amounts} onChange={(v) => upd('donation.amounts', v)} /><span className="hint">Comma-separated, e.g. 500, 1000, 2500</span></div>
      <Lines p="donation.instructions" label="How-to-donate steps" /><T p="donation.confirmVia" label="Where donors send their payment reference" /></div>,
    volunteer: <div className="stack"><Lines p="volunteer.interests" label="Areas of interest" /><Lines p="volunteer.availability" label="Availability options" /><Lines p="volunteer.terms" label="Volunteer terms" /><T p="volunteer.consent" label="Consent statement" area /></div>,
    contact: <div className="stack"><ImgField label="Logo" value={d.logo} round folder="logo" onChange={(v) => upd('logo', v || DEFAULT_LOGO)} /><T p="name" label="Initiative name" /><div className="two"><T p="contact.email" label="Email" /><T p="contact.phone" label="Phone" /></div><T p="contact.location" label="Location" /><div className="two"><T p="contact.instagram.handle" label="Instagram handle" /><T p="contact.instagram.url" label="Instagram link" /></div></div>
  };

  return (
    <AdCtx.Provider value={{ d, upd, upload }}>
      <main id="main" className="ad-wrap"><div className="wrap">
        <div className="ad-head">
          <div><span className="badge"><i></i>Admin portal</span><h1 className="h2" style={{ marginTop: '12px' }}>Manage the website</h1><p className="hint" style={{ fontSize: '14px', marginTop: '6px' }}>Changes go live for all visitors as soon as you save.</p></div>
          <div className="ad-save">
            <span className="hint" role="status">{state === 'dirty' ? 'Unsaved changes' : state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved ✓' : state === 'error' ? msg : 'All changes saved'}</span>
            <SmartLink to="home" className="btn btn-wh btn-sm">View site</SmartLink>
            <button type="button" className="btn btn-wh btn-sm" onClick={onSignOut}>Sign out</button>
            <button type="button" className="btn btn-or" disabled={state === 'saving' || state === 'idle' || state === 'saved'} onClick={save}>{state === 'saving' ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
        <div className="ad-g">
          <nav className="ad-tabs" aria-label="Sections">{TABS.map(([k, l]) => <button key={k} type="button" className={'ad-tab' + (tab === k ? ' on' : '')} aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)}>{l}</button>)}</nav>
          <div className="ad-panel"><h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '18px' }}>{TABS.find((t) => t[0] === tab)![1]}</h2>{panels[tab]}</div>
        </div>
      </div></main>
    </AdCtx.Provider>
  );
}

/** Keeps the raw text while typing so commas/spaces aren't eaten; parses on change. */
function AmountsInput({ value, onChange }: { value: number[]; onChange: (v: number[]) => void }) {
  const [txt, setTxt] = useState((value || []).join(', '));
  return <input id="ad-amts" value={txt} onChange={(e) => { setTxt(e.target.value); onChange(e.target.value.split(',').map((x) => Number(x.trim())).filter((x) => x > 0)); }} />;
}
