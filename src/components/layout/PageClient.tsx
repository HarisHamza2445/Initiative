'use client';
import { useEffect } from 'react';
import { useGsap } from '@/lib/useGsap';

/** Scroll-reveal animations (.rise / .pop) for standalone pages; scrolls to top on entry like the prototype. */
export function PageClient() {
  useEffect(() => { scrollTo({ top: 0 }); }, []);
  useGsap('page');
  return null;
}
