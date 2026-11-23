'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { hrefFor } from '@/lib/routes';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

/** Link to a home section ('about', 'donate' …) or a page ('gallery', 'volunteer' …). */
export const SmartLink = forwardRef<HTMLAnchorElement, Props>(function SmartLink({ to, ...rest }, ref) {
  const onHome = usePathname() === '/';
  const href = hrefFor(to, onHome);
  if (href.startsWith('#')) return <a ref={ref} href={href} {...rest} />;
  return <Link ref={ref} href={href} {...rest} />;
});

export function useHref() {
  const onHome = usePathname() === '/';
  return (id: string) => hrefFor(id, onHome);
}
