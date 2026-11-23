'use client';
/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useSite } from '@/lib/site-context';
import { fade, reduced, spring, tap } from '@/lib/motion';
import { EMPTY_VOLUNTEER, validateVolunteer, type VolunteerErrors, type VolunteerFields } from '@/lib/volunteer';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { SignaturePad, typedToImage } from './SignaturePad';

type ListKey = 'interests' | 'availability';
type TextKey = Exclude<keyof VolunteerFields, ListKey>;
type Errs = VolunteerErrors & { agree?: string; sig?: string; submit?: string };
type Done = VolunteerFields & { id: string; signedAt: string; image: string };

function Fld({ id, label, opt, children, e }: { id: string; label: string; opt?: boolean; children: React.ReactNode; e?: string }) {
  return (
    <div className={'fld' + (e ? ' bad' : '')}>
      <label htmlFor={id}>{label}{opt && <> <span className="opt2">(optional)</span></>}</label>
      {children}
      {e && <span className="ferr" id={id + '-e'}>{e}</span>}
    </div>
  );
}

export function VolunteerForm() {
  const S = useSite();
  const V = S.volunteer;
  const [step, setStep] = useState(1), [f, setF] = useState<VolunteerFields>(EMPTY_VOLUNTEER), [err, setErr] = useState<Errs>({});
  const [agree, setAgree] = useState(false), [mode, setMode] = useState<'draw' | 'type'>('draw'), [drawn, setDrawn] = useState(''), [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false), [done, setDone] = useState<Done | null>(null);
  const top = useRef<HTMLElement>(null);
  const set = (k: TextKey) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const tog = (k: ListKey, v: string) => setF({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });
  const up = () => top.current?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });

  const toSign = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validateVolunteer(f);
    setErr(e);
    if (Object.keys(e).length) {
      setTimeout(() => { const el = document.querySelector<HTMLElement>('.fld.bad input, .fld.bad textarea, .ferr'); el?.scrollIntoView({ block: 'center' }); el?.focus?.(); }, 20);
      return;
    }
    setStep(2); up();
  };
  const sigOk = mode === 'draw' ? !!drawn : typed.trim().length >= 2;
  const submit = async () => {
    const e: Errs = {};
    if (!agree) e.agree = 'Please read and agree to the volunteer terms.';
    if (!sigOk) e.sig = 'Your signature is required to complete the application.';
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const image = mode === 'draw' ? drawn : typedToImage(typed.trim());
    const signedAt = new Date().toISOString();
    try {
      const r = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...f, consent: { agreed: true, text: V.consent, terms: V.terms }, signature: { method: mode, image, typedName: mode === 'type' ? typed.trim() : '', signedAt } })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.id) throw new Error(j.error || 'failed');
      setDone({ ...f, id: j.id, signedAt: j.signedAt || signedAt, image });
      up();
    } catch {
      // Never show the thank-you screen unless the application was actually saved.
      setErr({ submit: `We couldn’t submit your application. Please try again, or email us at ${S.contact.email}.` });
    }
    setBusy(false);
  };

  const inp = (k: TextKey, type: string, ph: string, ac: string) => (
    <input id={'v-' + k} type={type} value={f[k]} onChange={set(k)} placeholder={ph} autoComplete={ac} aria-invalid={!!err[k]} aria-describedby={err[k] ? 'v-' + k + '-e' : undefined} />
  );
  const chipGroup = (k: ListKey, opts: string[], lid: string, label: string) => (
    <div className="stack" style={{ gap: '10px' }}><span className="lbl" id={lid}>{label}</span>
      <div className="chips" role="group" aria-labelledby={lid}>{opts.map((x) => (
        <motion.button key={x} type="button" whileTap={tap} className={'chip' + (f[k].includes(x) ? ' on' : '')} aria-pressed={f[k].includes(x)} onClick={() => tog(k, x)}>
          {f[k].includes(x) && <span className="ck"><Icon d="check" s={14} w={2.6} /></span>}{x}
        </motion.button>
      ))}</div>
      {err[k] && <span className="ferr">{err[k]}</span>}</div>
  );
  const cur = done ? 3 : step;
  return (
    <main id="main" className="vp" ref={top} style={{ scrollMarginTop: '20px' }}>
      <div className="wrap">
        <div className="vp-head"><span className="badge"><i></i>Volunteer registration</span><h1 className="h1" style={{ fontSize: 'clamp(38px,5.6vw,72px)' }}>Give your time.<br /><span className="or">Change a story.</span></h1>
          <p className="lead" style={{ maxWidth: '600px' }}>Join us on-ground in Pune or remotely from anywhere. Fill in your details, read the volunteer terms and sign — it takes about five minutes.</p></div>
        <div className="vp-g">
          <aside className="vp-side" aria-label="Application progress">{[['1', 'Your details'], ['2', 'Terms & signature'], ['3', 'Confirmation']].map(([n, l]) => (
            <div key={n} className={'vps' + (cur === +n ? ' on' : '') + (cur > +n ? ' done' : '')} aria-current={cur === +n ? 'step' : undefined}><i>{cur > +n ? <Icon d="check" s={14} w={2.6} /> : n}</i>{l}</div>
          ))}</aside>
          <div className="vcard"><AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" className="stack" {...fade} role="status" aria-live="polite">
                <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(180deg,#D4AE62,#A8802F)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 40px rgba(27,42,74,.35)' }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><motion.path d="M5 12l5 5 9-10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.5 }} /></svg>
                </motion.span>
                <h2 className="h2" style={{ fontSize: 'clamp(28px,3.4vw,42px)' }}>Thank you, <span className="or">{done.name.split(' ')[0]}!</span></h2>
                <p className="lead" style={{ fontSize: '16px' }}>Your volunteer application is complete and signed. If you’re a good fit, our team will be in touch at <b>{done.email}</b>.</p>
                <div className="sumry"><div><span>Application ID</span><b>{done.id}</b></div><div><span>Signed</span><b>{new Date(done.signedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</b></div><div><span>Interests</span><b style={{ textAlign: 'right' }}>{done.interests.join(', ')}</b></div></div>
                <img className="sigimg" src={done.image} alt={'Signature of ' + done.name} />
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}><SmartLink to="home" className="btn btn-or">Back to home</SmartLink><a href={S.contact.instagram.url} className="btn btn-wh">Follow our work</a></div>
              </motion.div>
            ) : step === 1 ? (
              <motion.form key="v1" className="stack" style={{ gap: '22px' }} {...fade} noValidate onSubmit={toSign} aria-label="Volunteer details">
                <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-.02em' }}>Your details</h2>
                <div className="two">
                  <Fld id="v-name" label="Full name" e={err.name}>{inp('name', 'text', 'Your full name', 'name')}</Fld>
                  <Fld id="v-email" label="Email address" e={err.email}>{inp('email', 'email', 'you@email.com', 'email')}</Fld>
                  <Fld id="v-phone" label="Phone number" e={err.phone}>{inp('phone', 'tel', '+91 98765 43210', 'tel')}</Fld>
                  <Fld id="v-city" label="City / location" e={err.city}>{inp('city', 'text', 'e.g. Pune', 'address-level2')}</Fld>
                </div>
                {chipGroup('interests', V.interests, 'int-l', 'Areas of interest')}
                <Fld id="v-skills" label="Skills and experience" e={err.skills}><textarea id="v-skills" value={f.skills} onChange={set('skills')} placeholder="e.g. teaching, Canva, video editing, event planning…" aria-invalid={!!err.skills}></textarea></Fld>
                {chipGroup('availability', V.availability, 'av-l', 'Availability')}
                <Fld id="v-why" label="Why do you want to volunteer?" e={err.why}><textarea id="v-why" value={f.why} onChange={set('why')} placeholder="Share what moves you" aria-invalid={!!err.why}></textarea></Fld>
                <Fld id="v-extra" label="Additional information" opt><textarea id="v-extra" value={f.extra} onChange={set('extra')} placeholder="Anything else we should know"></textarea></Fld>
                {Object.keys(err).length > 0 && <p className="ferr" role="alert">Please fix the highlighted fields to continue.</p>}
                <div><button type="submit" className="btn btn-or">Continue to terms &amp; signature <Icon d="arrow" s={18} /></button></div>
              </motion.form>
            ) : (
              <motion.div key="v2" className="stack" style={{ gap: '22px' }} {...fade}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-.02em' }}>Volunteer terms</h2>
                <div className="terms" tabIndex={0} aria-label="Volunteer terms"><b>By volunteering with {S.name}, I agree that:</b><ol>{V.terms.map((t) => <li key={t}>{t}</li>)}</ol></div>
                <button type="button" className="chk" role="checkbox" aria-checked={agree} onClick={() => setAgree(!agree)}><span className={'box' + (agree ? ' on' : '')}>{agree && <Icon d="check" s={16} c="#fff" w={3} />}</span><span>{V.consent}</span></button>
                {err.agree && <span className="ferr" role="alert">{err.agree}</span>}
                <div className="stack" style={{ gap: '14px', borderTop: '1px solid var(--line)', paddingTop: '22px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-.02em' }}>Your signature</h2>
                    <LayoutGroup><div className="sigtabs" role="tablist" aria-label="Signature method">{([['draw', 'Draw'], ['type', 'Type']] as const).map(([k, l]) => (
                      <button key={k} type="button" role="tab" aria-selected={mode === k} className={'tg' + (mode === k ? ' on' : '')} onClick={() => setMode(k)}>{mode === k && <motion.span layoutId="sig-pill" className="pl" transition={spring} />}<span>{l}</span></button>
                    ))}</div></LayoutGroup>
                  </div>
                  {mode === 'draw'
                    ? <SignaturePad onChange={setDrawn} />
                    : <div className="stack" style={{ gap: '10px' }}><div className="fld"><label htmlFor="v-typed">Type your full name as your signature</label><input id="v-typed" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={f.name || 'Your full name'} /></div><div className="typed" aria-hidden="true">{typed || <span style={{ opacity: 0.3 }}>{f.name || 'Your signature'}</span>}</div></div>}
                  {err.sig && <span className="ferr" role="alert">{err.sig}</span>}
                  <p style={{ fontSize: '13px', color: 'var(--soft)' }}>Signing as <b>{f.name}</b> on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}.</p>
                </div>
                {err.submit && <span className="ferr" role="alert">{err.submit}</span>}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}><button type="button" className="btn btn-wh" onClick={() => { setStep(1); up(); }}>Back</button><button type="button" className="btn btn-or" disabled={busy} aria-busy={busy} onClick={submit} style={busy ? { opacity: 0.7 } : undefined}>{busy ? 'Submitting…' : 'Submit signed application'}</button></div>
              </motion.div>
            )}
          </AnimatePresence></div>
        </div>
      </div>
    </main>
  );
}
