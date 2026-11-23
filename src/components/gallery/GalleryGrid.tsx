'use client';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { useSite } from '@/lib/site-context';
import { spring } from '@/lib/motion';
import { Photo } from '@/components/ui/Photo';
import { Lightbox } from './Lightbox';

export function GalleryGrid({ limit, filters }: { limit?: number; filters?: boolean }) {
  const { gallery } = useSite();
  const cats = useMemo(() => ['All', ...Array.from(new Set(gallery.map((g) => g.category).filter(Boolean)))], [gallery]);
  const [cat, setCat] = useState('All'), [lb, setLb] = useState(-1);
  const list = useMemo(() => gallery.filter((g) => cat === 'All' || g.category === cat).slice(0, limit || 999), [cat, limit, gallery]);
  const go = useCallback((d: number) => setLb((i) => (i + d + list.length) % list.length), [list.length]);
  const close = useCallback(() => setLb(-1), []);
  return (
    <Fragment>
      {filters && <LayoutGroup><div className="gfil" role="group" aria-label="Filter photos">{cats.map((c) => (
        <button key={c} className={'gf' + (cat === c ? ' on' : '')} aria-pressed={cat === c} onClick={() => setCat(c)}>{cat === c && <motion.span layoutId="gf-pill" className="pl2" transition={spring} />}<span>{c}</span></button>
      ))}</div></LayoutGroup>}
      <div className="gal">
        {list.map((g, i) => (
          <motion.button key={cat + g.caption + i} className="gi" onClick={() => setLb(i)} aria-label={'Open photo: ' + g.caption}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 200, damping: 24, delay: (i % 3) * 0.06 }}>
            <figure style={{ margin: 0 }}>
              <Photo src={g.src} alt={g.caption} label={g.src ? '' : 'Placeholder'} style={{ aspectRatio: g.tall ? '4/5' : '4/3' }} />
              <figcaption>{g.category && <span className="cat">{g.category}</span>}<b>{g.caption}</b><span>{g.description}</span></figcaption>
            </figure>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{lb >= 0 && <Lightbox key="lb" items={list} index={lb} onClose={close} onGo={go} />}</AnimatePresence>
    </Fragment>
  );
}
