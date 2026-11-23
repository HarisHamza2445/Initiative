'use client';
import { useSite } from '@/lib/site-context';
import { telHref } from '@/lib/format';
import { Icon, type IconName } from '@/components/ui/Icon';

export function Contact() {
  const C = useSite().contact;
  const items: [IconName, string, string, string][] = [['mail', 'Email', C.email, 'mailto:' + C.email], ['phone', 'Phone', C.phone, telHref(C.phone)], ['pin', 'Location', C.location, ''], ['ig', 'Instagram', C.instagram.handle, C.instagram.url]];
  return (
    <section className="sec" id="contact" style={{ paddingTop: '40px' }}>
      <div className="wrap">
        <div className="head c"><span className="badge rise"><i></i>Contact</span><h2 className="h2 rise">Let’s <span className="or">talk.</span></h2><p className="lead rise" style={{ maxWidth: '520px' }}>Questions about volunteering, donating or partnering with us? Reach out — we’d love to hear from you.</p></div>
        <div className="ct-g">{items.map(([ic, l, v, href]) => <div className="ctc pop" key={l}><span className="ic"><Icon d={ic} s={22} /></span><span className="eyebrow">{l}</span>{href ? <a href={href}>{v}</a> : <span className="v">{v}</span>}</div>)}</div>
      </div>
    </section>
  );
}
