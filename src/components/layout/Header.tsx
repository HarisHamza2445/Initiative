'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useSite } from '@/lib/site-context';
import { NAV, isPage } from '@/lib/routes';
import { Icon } from '@/components/ui/Icon';
import { Brand } from '@/components/ui/Brand';
import { Magnetic } from '@/components/ui/Magnetic';
import { SmartLink } from '@/components/ui/SmartLink';
import { useHash } from './useHash';

const MotionSmartLink = motion.create(SmartLink);

export function Header() {
  const S = useSite();
  const pathname = usePathname();
  const hash = useHash();
  const [solid, setSolid] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => { const on = () => setSolid(scrollY > 20); on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on); }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [open]);
  const page = pathname.replace(/^\//, '').split('/')[0];
  const cur = isPage(page) ? page : NAV.some(([id]) => id === hash) ? hash : 'home';
  return (
    <Fragment>
      <div className="topbar">
        {S.announcement && <div className={'ann' + (solid ? ' gone' : '')} role="note"><b>●</b> {S.announcement}</div>}
        <header className={'nav' + (solid ? ' solid' : '')}>
          <div className="nav-in">
            <Brand />
            <nav className="links" aria-label="Main">
              {NAV.map(([id, l]) => <SmartLink key={id} to={id} className={cur === id ? 'on' : ''} aria-current={cur === id ? 'page' : undefined}>{l}</SmartLink>)}
            </nav>
            <div className="nav-r">
              <Magnetic className="btn btn-or btn-sm" to="donate">Donate now</Magnetic>
              <button className="menu-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Icon d="menu" s={22} /></button>
            </div>
          </div>
        </header>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mnav" role="dialog" aria-modal="true" aria-label="Menu" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="mnav-top"><Brand onClick={() => setOpen(false)} /><button className="xb" aria-label="Close menu" autoFocus onClick={() => setOpen(false)}><Icon d="x" s={22} /></button></div>
            <nav style={{ marginTop: '28px', display: 'flex', flexDirection: 'column' }} aria-label="Mobile">
              {NAV.map(([id, l], i) => (
                <MotionSmartLink key={id} className="ml" to={id} onClick={() => setOpen(false)} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.04 + i * 0.04 } }}>
                  {l}<Icon d="arrow" s={20} c="#A8802F" />
                </MotionSmartLink>
              ))}
            </nav>
            <SmartLink to="donate" className="btn btn-or" style={{ marginTop: '28px' }} onClick={() => setOpen(false)}>Donate now</SmartLink>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
}
