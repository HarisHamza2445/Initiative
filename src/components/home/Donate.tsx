'use client';
/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useSite } from '@/lib/site-context';
import { fade, tap } from '@/lib/motion';
import { Icon } from '@/components/ui/Icon';
import { Magnetic } from '@/components/ui/Magnetic';

type Err = { amount?: string; purpose?: string; other?: string };

/** Records the donor's choice as a pledge ("awaiting verification"). Never blocks or changes the QR flow. */
async function recordPledge(body: object): Promise<string | null> {
  try {
    const r = await fetch('/api/pledge', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) return null;
    const j = await r.json();
    return typeof j.id === 'string' ? j.id : null;
  } catch {
    return null;
  }
}

export function Donate() {
  const D = useSite().donation;
  const [step, setStep] = useState(1), [amt, setAmt] = useState(D.amounts[1] || D.amounts[0]), [custom, setCustom] = useState('');
  const [purpose, setPurpose] = useState(''), [other, setOther] = useState(''), [name, setName] = useState(''), [err, setErr] = useState<Err>({});
  const pledgeId = useRef<string | null>(null);
  const amount = custom ? Number(custom) : amt;
  const fmt = (v: number) => D.currency + Number(v).toLocaleString('en-IN');
  const next = () => {
    const e: Err = {};
    if (!amount || amount < 1) e.amount = 'Choose an amount or enter your own.';
    if (!purpose) e.purpose = 'Please choose what you’d like to donate towards.';
    if (purpose === 'Other' && !other.trim()) e.other = 'Please tell us the purpose.';
    setErr(e);
    if (Object.keys(e).length) return;
    setStep(2);
    recordPledge({ amount, purpose, purposeOther: purpose === 'Other' ? other.trim() : '', name: name.trim(), replaces: pledgeId.current }).then((id) => { if (id) pledgeId.current = id; });
  };
  return (
    <section className="sec" id="donate" style={{ paddingTop: '40px' }}>
      <div className="wrap don-g">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'sticky', top: '110px' }}>
          <span className="badge rise" style={{ alignSelf: 'flex-start' }}><i></i>Donate</span>
          <h2 className="h2 rise">Your support can<br /><span className="or">change a life.</span></h2>
          <p className="lead rise">{D.intro}</p>
          <div className="note rise"><Icon d="heart" s={18} /><span>You choose exactly what your donation goes towards — and we’ll make sure it’s used for that purpose.</span></div>
        </div>
        <div className="dcard pop">
          <div className="dsteps" aria-hidden="true">{['1. Choose amount & purpose', '2. Scan & pay'].map((l, i) => <div key={l} className={'dst' + (step >= i + 1 ? ' on' : '')}><i><motion.b initial={false} animate={{ scaleX: step >= i + 1 ? 1 : 0 }} transition={{ duration: 0.5 }} /></i>{l}</div>)}</div>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="d1" className="stack" style={{ gap: '22px' }} {...fade}>
                <div className="stack" style={{ gap: '12px' }}>
                  <span className="lbl" id="amt-l">Donation amount</span>
                  <div className="amts" role="group" aria-labelledby="amt-l">{D.amounts.map((a) => <motion.button key={a} type="button" whileTap={tap} className={'amt' + (!custom && amt === a ? ' on' : '')} aria-pressed={!custom && amt === a} onClick={() => { setAmt(a); setCustom(''); }}>{fmt(a)}</motion.button>)}</div>
                  <div className={'fld' + (err.amount ? ' bad' : '')}><label htmlFor="d-c">Or enter a custom amount</label><div className="pre"><span>{D.currency}</span><input id="d-c" inputMode="numeric" placeholder="Any amount" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))} aria-invalid={!!err.amount} /></div>{err.amount && <span className="ferr" role="alert">{err.amount}</span>}</div>
                </div>
                <div className="stack" style={{ gap: '12px' }}>
                  <span className="lbl" id="pur-l">What exactly would you like to donate towards?</span>
                  <div className="chips" role="radiogroup" aria-labelledby="pur-l">{D.purposes.map((p) => <motion.button key={p} type="button" role="radio" whileTap={tap} aria-checked={purpose === p} className={'chip' + (purpose === p ? ' on' : '')} onClick={() => setPurpose(p)}>{p}</motion.button>)}</div>
                  {err.purpose && <span className="ferr" role="alert">{err.purpose}</span>}
                  <AnimatePresence>{purpose === 'Other' && (
                    <motion.div className={'fld' + (err.other ? ' bad' : '')} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <label htmlFor="d-o">Please specify</label><input id="d-o" value={other} onChange={(e) => setOther(e.target.value)} placeholder="e.g. school bags for a class" aria-invalid={!!err.other} />{err.other && <span className="ferr" role="alert">{err.other}</span>}
                    </motion.div>
                  )}</AnimatePresence>
                </div>
                <div className="fld"><label htmlFor="d-n">Your name <span className="opt2">(optional)</span></label><input id="d-n" value={name} onChange={(e) => setName(e.target.value)} placeholder="So we can thank you" /></div>
                <Magnetic className="btn btn-or" onClick={next}>Continue to payment <Icon d="arrow" s={18} /></Magnetic>
              </motion.div>
            ) : (
              <motion.div key="d2" className="stack" style={{ gap: '22px' }} {...fade}>
                <div className="sumry"><div><span>Amount</span><b>{fmt(amount)}</b></div><div><span>Towards</span><b>{purpose === 'Other' ? other.trim() : purpose}</b></div>{name && <div><span>Name</span><b>{name}</b></div>}</div>
                <div className="qr-g">
                  <div className="qr" aria-label={D.qrImage ? 'Donation QR code' : 'Donation QR code placeholder'}>{D.qrImage
                    ? <img src={D.qrImage} alt="Donation UPI QR code" />
                    : <><Icon d="qr" s={44} w={1.5} c="#A8802F" /><b style={{ color: '#1B2A4A', fontSize: '14px' }}>QR code coming soon</b><span>Our donation QR will appear here.</span></>}</div>
                  <div className="stack" style={{ gap: '14px' }}><b style={{ fontWeight: 700, fontSize: '19px' }}>How to donate</b><ol className="ol">{D.instructions.map((t) => <li key={t}>{t}</li>)}</ol>
                    {D.upiId && <p style={{ fontSize: '14px' }}>UPI ID: <b>{D.upiId}</b> · {D.payee}</p>}</div>
                </div>
                <div className="note"><Icon d="info" s={18} /><span>This page doesn’t process or confirm payments. After paying, please share your transaction reference with us on {D.confirmVia} so our team can verify and acknowledge your donation.</span></div>
                <button type="button" className="btn btn-wh" onClick={() => setStep(1)}>Change amount or purpose</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
