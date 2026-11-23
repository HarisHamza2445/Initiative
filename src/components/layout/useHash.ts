'use client';
import { useSyncExternalStore } from 'react';

const sub = (cb: () => void) => { addEventListener('hashchange', cb); return () => removeEventListener('hashchange', cb); };

/** Current location.hash without the '#' ('' during SSR). */
export function useHash() {
  return useSyncExternalStore(sub, () => location.hash.replace('#', ''), () => '');
}
