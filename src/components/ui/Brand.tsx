'use client';
/* eslint-disable @next/next/no-img-element */
import { useSite } from '@/lib/site-context';
import { DEFAULT_LOGO } from '@/lib/site-defaults';
import { SmartLink } from './SmartLink';

export const Mark = () => {
  const S = useSite();
  return <span className="mark"><img src={S.logo || DEFAULT_LOGO} alt="" /></span>;
};

export function Brand({ onClick, light }: { onClick?: () => void; light?: boolean }) {
  const S = useSite();
  return (
    <SmartLink to="home" className="brand" onClick={onClick} style={light ? { color: '#fff' } : undefined} aria-label={S.name + ' home'}>
      <Mark />
      <span className="lockup"><span className="l1">The</span><span className="l2">Shubmaan</span><span className="l3">Initiative</span></span>
    </SmartLink>
  );
}
