'use client';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';
import { reduced, spring } from '@/lib/motion';
import { Icon } from '@/components/ui/Icon';

const CMP = {
  without: [['Learning stops when school support runs out', 0], ['Hungry days make it hard to focus', 0], ['No one to talk to about what they feel', 0], ['Dreams stay dreams — no map to reach them', 0]],
  with: [['Regular learning sessions and supplies', 1], ['Nutritious meals through food drives', 1], ['A safe space for psychological support', 1], ['Career guidance and a real pathway', 1]]
} as const;
type Mode = keyof typeof CMP;

export function Why() {
  const [cmp, setCmp] = useState<Mode>('without');
  useEffect(() => {
    if (reduced()) return;
    let t: ReturnType<typeof setTimeout>;
    const st = ScrollTrigger.create({ trigger: '.cmp', start: 'top 55%', once: true, onEnter: () => { t = setTimeout(() => setCmp('with'), 900); } });
    return () => { st.kill(); clearTimeout(t); };
  }, []);
  const lit = cmp === 'with' ? 0.85 : 0.18;
  const dots = Array.from({ length: 60 }, (_, i) => ((i * 37) % 60) / 60 < lit);
  return (
    <section className="sec">
      <div className="wrap cmp">
        <div className="cmp-l">
          <span className="badge rise" style={{ alignSelf: 'flex-start' }}><i></i>The difference</span>
          <h2 className="h2 rise">Talent is everywhere.<br /><span className="or">Opportunity isn’t.</span></h2>
          <LayoutGroup><div className="toggle rise" role="tablist" aria-label="Compare">
            {([['without', 'Without support'], ['with', 'With Shubmaan']] as [Mode, string][]).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={cmp === k} className={'tg' + (cmp === k ? ' on' : '')} onClick={() => setCmp(k)}>
                {cmp === k && <motion.span layoutId="tg-pill" className="pl" transition={spring} />}<span>{l}</span>
              </button>
            ))}
          </div></LayoutGroup>
          <div className="cmp-list"><AnimatePresence mode="wait">
            <motion.div key={cmp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}>
              {CMP[cmp].map(([t, ok], i) => (
                <motion.div key={t} className="ci" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <b style={{ background: ok ? '#DDF5EA' : '#F3E3DC' }}><Icon d={ok ? 'check' : 'x'} s={13} c={ok ? '#1D6B4A' : '#9B2C1F'} w={3} /></b>{t}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence></div>
        </div>
        <div className="grid-card pop">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', gap: '12px' }}><b style={{ fontWeight: 700, fontSize: '17px' }}>Dreams with a path</b><span className={'pillst' + (cmp === 'with' ? ' g' : '')}>{cmp === 'with' ? 'With support' : 'Without support'}</span></div>
          <div className="dotgrid" aria-hidden="true">{dots.map((on, i) => <motion.span key={i} className={'dg' + (on ? ' on' : '')} animate={{ scale: on ? [0.6, 1.15, 1] : 1 }} transition={{ delay: (i % 10) * 0.03 + Math.floor(i / 10) * 0.03, duration: 0.4 }} />)}</div>
          <div className="gc-cap"><span>Each dot is a child’s dream.</span><span>Illustrative</span></div>
        </div>
      </div>
    </section>
  );
}
