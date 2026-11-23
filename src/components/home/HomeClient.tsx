'use client';
import { useEffect } from 'react';
import { useGsap } from '@/lib/useGsap';
import { reduced } from '@/lib/motion';
import { isPage } from '@/lib/routes';

/** Runs the home animations and the prototype's hash scrolling (#about → smooth scroll with an 80px offset). */
export function HomeClient() {
  useGsap('home');
  useEffect(() => {
    const go = () => {
      const route = location.hash.replace('#', '');
      if (isPage(route)) return; // handled by LegacyHashRedirect
      if (!route || route === 'home') { scrollTo({ top: 0 }); return; }
      const el = document.getElementById(route);
      if (el) setTimeout(() => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: reduced() ? 'auto' : 'smooth' }), 60);
    };
    if (location.hash) go();
    addEventListener('hashchange', go);
    return () => removeEventListener('hashchange', go);
  }, []);
  return null;
}
