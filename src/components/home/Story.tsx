'use client';
import { useSite } from '@/lib/site-context';

export function Story() {
  const T = useSite().story;
  return (
    <section className="sec" id="story" style={{ paddingTop: '40px' }}>
      <div className="wrap">
        <div className="head c"><span className="badge rise"><i></i>Our story</span><h2 className="h2 rise" style={{ maxWidth: '820px' }}>{T.heading}</h2></div>
        <div className="st-g">
          <div className="st-card pop"><span className="eyebrow">Named after an inspiration</span><p>{T.named}</p></div>
          <div className="st-card dk pop"><span className="eyebrow">The extra “aa”</span><div className="dev">शुभ + मन</div><p>{T.extra}</p></div>
        </div>
        <div className="st-vals">{T.values.map(([t, p], i) => <div className="st-v pop" key={t + i}><span className="n">0{i + 1}</span><b>{t}</b><p>{p}</p></div>)}</div>
        <p className="st-close rise">{T.closing}</p>
      </div>
    </section>
  );
}
