'use client';
/* eslint-disable @next/next/no-img-element */
import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useSite } from '@/lib/site-context';
import { money } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { SmartLink } from '@/components/ui/SmartLink';
import { Lightbox, type LbItem } from '@/components/gallery/Lightbox';

const fmtD = (d: string) => { if (!d) return ''; const x = new Date(d); return isNaN(+x) ? d : x.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); };

export function UpdatesList() {
  const S = useSite();
  const list = (S.updates || []).slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const total = list.reduce((t, u) => t + money(u.amount), 0);
  const [lb, setLb] = useState<{ items: LbItem[]; i: number } | null>(null);
  const cur = S.donation.currency;
  const close = useCallback(() => setLb(null), []);
  const go = useCallback((d: number) => setLb((s) => (s ? { ...s, i: (s.i + d + s.items.length) % s.items.length } : s)), []);
  return (
    <>
      <div className="up-sum">
        <div><b>{list.length}</b><span>updates shared</span></div>
        {total > 0 && <div><b>{cur}{total.toLocaleString('en-IN')}</b><span>spent, as listed in these updates</span></div>}
        <div><SmartLink to="donate" className="btn btn-or btn-sm">Donate now</SmartLink></div>
      </div>
      {list.length === 0 && <div className="up-empty"><Icon d="info" s={22} />Updates will appear here soon.</div>}
      <div className="up-list">
        {list.map((u) => {
          const ph = (u.photos || []).filter(Boolean);
          const items = ph.map((src) => ({ src, caption: u.title, description: u.summary }));
          const br = (u.breakdown || []).filter((r) => r && (r.item || r.amount));
          return (
            <article className="up pop" key={u.id || u.title}>
              <div className="up-ph">{ph.length ? ph.slice(0, 4).map((src, i) => (
                <button key={src + i} className={'up-t up-t' + i + (ph.length === 1 ? ' solo' : '')} onClick={() => setLb({ items, i })} aria-label={'Open photo ' + (i + 1) + ' of ' + u.title}>
                  <img src={src} alt="" loading="lazy" />{i === 3 && ph.length > 4 && <span className="more">+{ph.length - 4}</span>}
                </button>
              )) : <Photo label="No photos yet" />}</div>
              <div className="up-b">
                <div className="up-meta">{u.category && <span className="pillst">{u.category}</span>}{u.date && <span>{fmtD(u.date)}</span>}{u.location && <span>· {u.location}</span>}</div>
                <h2>{u.title}</h2>
                <p>{u.summary}</p>
                <div className="up-fund">
                  {money(u.amount)
                    ? <div className="up-amt"><span>Funds used</span><b>{cur}{money(u.amount).toLocaleString('en-IN')}</b></div>
                    : <div className="up-amt pend"><span>Funds used</span><b>Details coming soon</b></div>}
                  {br.length > 0 && <table className="up-tbl"><tbody>{br.map((r, i) => <tr key={i}><td>{r.item}</td><td>{money(r.amount) ? cur + money(r.amount).toLocaleString('en-IN') : (r.amount || '')}</td></tr>)}</tbody></table>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <AnimatePresence>{lb && <Lightbox key="lb" items={lb.items} index={lb.i} onClose={close} onGo={go} />}</AnimatePresence>
    </>
  );
}
