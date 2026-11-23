'use client';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type CSSProperties, type MouseEvent } from 'react';
import { tap, reduced } from '@/lib/motion';
import { useHref } from './SmartLink';

const MotionLink = motion.create(Link);

type Props = { children: React.ReactNode; className?: string; onClick?: () => void; to?: string; strength?: number; style?: CSSProperties };

/** Button / link that drifts toward the pointer. `to` is a section or page id (see lib/routes). */
export function Magnetic({ children, className, onClick, to, strength = 0.25, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const href = useHref();
  const move = (e: MouseEvent) => {
    if (reduced() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const common = {
    className,
    style: { x, y, ...(style || {}) },
    onMouseMove: move,
    onMouseLeave: () => { x.set(0); y.set(0); },
    whileTap: tap,
    onClick
  };
  if (to) {
    const h = href(to);
    if (h.startsWith('#')) return <motion.a ref={ref as React.Ref<HTMLAnchorElement>} href={h} {...common}>{children}</motion.a>;
    return <MotionLink ref={ref as React.Ref<HTMLAnchorElement>} href={h} {...common}>{children}</MotionLink>;
  }
  return <motion.button ref={ref as React.Ref<HTMLButtonElement>} type="button" {...common}>{children}</motion.button>;
}
