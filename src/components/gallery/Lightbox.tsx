'use client';
/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';

export type LbItem = { src: string; caption: string; description: string };

export function Lightbox({ items, index, onClose, onGo }: { items: LbItem[]; index: number; onClose: () => void; onGo: (d: number) => void }) {
  const it = items[index];
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onGo(1); if (e.key === 'ArrowLeft') onGo(-1); };
    addEventListener('keydown', k); document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose, onGo]);
  if (!it) return null;
  return (
    <motion.div className="lb" role="dialog" aria-modal="true" aria-label={'Photo: ' + it.caption} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <span className="lb-count">{index + 1} / {items.length}</span>
      <button className="xb lb-x" aria-label="Close" autoFocus onClick={onClose}><Icon d="x" s={22} /></button>
      {items.length > 1 && <button className="lb-nav" style={{ left: '18px' }} aria-label="Previous photo" onClick={() => onGo(-1)}><Icon d="left" s={22} /></button>}
      {items.length > 1 && <button className="lb-nav" style={{ right: '18px' }} aria-label="Next photo" onClick={() => onGo(1)}><Icon d="right" s={22} /></button>}
      <AnimatePresence mode="wait"><motion.div key={index} className="lb-img" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
        {it.src ? <img className="full" src={it.src} alt={it.caption} /> : <Photo label="Photo placeholder" />}
      </motion.div></AnimatePresence>
      <div className="lb-cap"><b>{it.caption}</b><span>{it.description}</span></div>
    </motion.div>
  );
}
