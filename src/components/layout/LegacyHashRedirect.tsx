'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isPage } from '@/lib/routes';

/** Old prototype links like /#gallery or /#volunteer now live at /gallery, /volunteer … */
export function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const go = () => { const h = location.hash.replace('#', ''); if (isPage(h)) router.replace('/' + h); };
    go();
    addEventListener('hashchange', go);
    return () => removeEventListener('hashchange', go);
  }, [router]);
  return null;
}
