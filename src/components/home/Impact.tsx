'use client';
import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useSite } from '@/lib/site-context';
import { reduced } from '@/lib/motion';
import { Magnetic } from '@/components/ui/Magnetic';

export function Impact() {
  const S = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(S.impact.value); // server HTML shows the real number; the count-up starts on the client
  useEffect(() => {
    if (reduced() || !ref.current) { setN(S.impact.value); return; }
    setN(0);
    let tw: gsap.core.Tween | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const o = { v: 0 };
      tw = gsap.to(o, { v: S.impact.value, duration: 2, ease: 'power2.out', onUpdate: () => setN(Math.round(o.v)) });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => { io.disconnect(); tw?.kill(); };
  }, [S.impact.value]);
  return (
    <section className="sec" id="impact" style={{ paddingTop: '40px' }}>
      <div className="wrap"><div className="impact pop" ref={ref}>
        <div className="glow3" aria-hidden="true"></div>
        <div>
          <span className="badge dk"><i></i>Our impact</span>
          <div className="bignum" style={{ marginTop: '24px' }} aria-label={S.impact.value + S.impact.suffix + ' ' + S.impact.label}><span aria-hidden="true">{n.toLocaleString('en-IN')}<span className="pl">{S.impact.suffix}</span></span></div>
          <div className="lab">{S.impact.label}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <p style={{ fontSize: 'clamp(20px,2.2vw,28px)', lineHeight: 1.45, fontWeight: 500 }}>Every one of them is a child who was fed, taught, listened to or guided — and the number only grows because people like you choose to show up.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}><Magnetic className="btn btn-or" to="donate">Help us reach more</Magnetic><Magnetic className="btn btn-wh" to="volunteer">Volunteer</Magnetic></div>
        </div>
      </div></div>
    </section>
  );
}
