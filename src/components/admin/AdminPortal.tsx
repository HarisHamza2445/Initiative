'use client';
import { useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getBrowserSupabase } from '@/lib/supabase/browser';
import { SmartLink } from '@/components/ui/SmartLink';
import { AdminEditor } from './AdminEditor';

type Phase = 'loading' | 'unconfigured' | 'signed-out' | 'not-admin' | 'admin';

const Msg = ({ children }: { children: React.ReactNode }) => (
  <main id="main" className="ad-wrap"><div className="wrap"><div className="ad-msg">{children}</div></div></main>
);

export function AdminPortal() {
  const sb = getBrowserSupabase();
  const [phase, setPhase] = useState<Phase>(sb ? 'loading' : 'unconfigured');

  useEffect(() => {
    if (!sb) return;
    let alive = true;
    const check = async (s: Session | null) => {
      if (!s) { if (alive) setPhase('signed-out'); return; }
      const { data } = await sb.rpc('is_admin');
      if (alive) setPhase(data ? 'admin' : 'not-admin');
    };
    sb.auth.getSession().then(({ data }) => check(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((ev, s) => { if (ev === 'SIGNED_IN' || ev === 'SIGNED_OUT') check(s); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [sb]);

  const signOut = async () => { await sb?.auth.signOut(); setPhase('signed-out'); };

  if (phase === 'loading') return <Msg>Loading the admin portal…</Msg>;
  if (phase === 'unconfigured') return <Msg><h1 className="h2">Admin portal</h1><p>The admin portal isn’t connected to the database yet. Add the Supabase keys described in the README, then redeploy.</p><SmartLink to="home" className="btn btn-or">Back to the website</SmartLink></Msg>;
  if (phase === 'not-admin') return <Msg><h1 className="h2">Admin only</h1><p>Only the site owner and editors can manage the website.</p><div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}><SmartLink to="home" className="btn btn-or">Back to the website</SmartLink><button type="button" className="btn btn-wh" onClick={signOut}>Sign out</button></div></Msg>;
  if (phase === 'signed-out') return <Login />;
  return <AdminEditor sb={sb!} onSignOut={signOut} />;
}

function Login() {
  const sb = getBrowserSupabase()!;
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setErr(error.message === 'Invalid login credentials' ? 'That email and password don’t match.' : 'Could not sign in. Please try again.');
  };
  return (
    <Msg>
      <h1 className="h2">Admin portal</h1>
      <p>Sign in to manage the website.</p>
      <form className="stack" style={{ width: '100%', textAlign: 'left' }} onSubmit={submit} noValidate>
        <div className="fld"><label htmlFor="ad-email">Email</label><input id="ad-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="fld"><label htmlFor="ad-pass">Password</label><input id="ad-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        {err && <span className="ferr" role="alert">{err}</span>}
        <button type="submit" className="btn btn-or" disabled={busy || !email || !password} style={busy ? { opacity: 0.7 } : undefined}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </Msg>
  );
}
