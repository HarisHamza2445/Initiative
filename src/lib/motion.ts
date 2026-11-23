'use client';
import { useEffect, useLayoutEffect } from 'react';

export const tap = { scale: 0.96 };
export const spring = { type: 'spring', stiffness: 380, damping: 32 } as const;
export const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 26 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
} as const;

/** prefers-reduced-motion, read at call time (false during SSR). */
export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
