'use client';
import { usePathname } from 'next/navigation';
import { useSite } from '@/lib/site-context';
import { NAV } from '@/lib/routes';
import { telHref } from '@/lib/format';
import { Brand } from '@/components/ui/Brand';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';

export function Footer() {
  const S = useSite();
  const C = S.contact;
  if (usePathname().startsWith('/admin')) return null;
  return (
    <footer className="ft"><div className="wrap">
      <div className="ft-g">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Brand light />
          <p style={{ color: '#B9C0D3', fontSize: '15px', lineHeight: 1.7, maxWidth: '380px' }}>{S.mission}</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}><SmartLink to="donate" className="btn btn-or btn-sm">Donate now</SmartLink><SmartLink to="volunteer" className="btn btn-sm btn-ghost-d">Volunteer</SmartLink></div>
        </div>
        <div><h4>Explore</h4><ul>{NAV.slice(0, 6).map(([id, l]) => <li key={id}><SmartLink to={id}>{l}</SmartLink></li>)}</ul></div>
        <div><h4>Get involved</h4><ul>
          <li><SmartLink to="donate">Donate</SmartLink></li>
          <li><SmartLink to="volunteer">Volunteer registration</SmartLink></li>
          <li><SmartLink to="updates">Where your money goes</SmartLink></li>
          <li><SmartLink to="contact">Contact us</SmartLink></li>
        </ul></div>
        <div><h4>Reach us</h4><ul>
          <li><a href={'mailto:' + C.email}>{C.email}</a></li>
          <li><a href={telHref(C.phone)}>{C.phone}</a></li>
          <li><span style={{ color: '#E6E9F2', fontSize: '15px' }}>{C.location}</span></li>
          <li><a href={C.instagram.url}>Instagram · {C.instagram.handle}</a></li>
        </ul></div>
      </div>
      <div className="ft-b"><span>© {new Date().getFullYear()} {S.name}. All rights reserved.</span><span className="ft-b-r">Together, we can make a difference.<SmartLink to="admin" className="ft-admin" aria-label="Admin portal" title="Admin portal"><Icon d="lock" s={15} /></SmartLink></span></div>
    </div></footer>
  );
}
