'use client';
import { createContext, useContext } from 'react';
import type { Site } from './site-defaults';

const SiteCtx = createContext<Site | null>(null);

export function SiteProvider({ value, children }: { value: Site; children: React.ReactNode }) {
  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}

export function useSite(): Site {
  const s = useContext(SiteCtx);
  if (!s) throw new Error('useSite must be used inside <SiteProvider>');
  return s;
}
