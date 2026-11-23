'use client';
import { useSite } from '@/lib/site-context';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { SmartLink } from '@/components/ui/SmartLink';

export function About() {
  const S = useSite();
  const firstImg = S.gallery.find((g) => /books/.test(g.src)) || S.gallery.filter((g) => g.src)[3];
  return (
    <section className="sec" id="about" style={{ paddingBottom: '40px' }}>
      <div className="wrap">
        <div className="head c"><span className="badge rise"><i></i>About us</span><h2 className="h2 rise">Who we are &amp; <span className="or">why we exist.</span></h2></div>
        <div className="intro-card pop">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <span className="eyebrow">Our story</span>
            <p style={{ fontSize: 'clamp(18px,1.7vw,22px)', lineHeight: 1.6, fontWeight: 500 }}>{S.intro}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}><SmartLink to="volunteer" className="btn btn-dk btn-sm">Join our work</SmartLink><SmartLink to="gallery" className="btn btn-wh btn-sm">See our work</SmartLink></div>
          </div>
          <Photo src={firstImg?.src} alt={firstImg?.caption} label="Photo — our team at work" />
        </div>
        <div className="about-g">
          <article className="ab pop"><span className="k"><Icon d="eye" s={24} /></span><h3>Our vision</h3><p>{S.vision}</p></article>
          <article className="ab pop"><span className="k"><Icon d="target" s={24} /></span><h3>Our mission</h3><p>{S.mission}</p></article>
          <article className="ab dk pop"><span className="k"><Icon d="link" s={24} /></span><h3>Our role &amp; purpose</h3><p>{S.role}</p></article>
        </div>
      </div>
    </section>
  );
}
