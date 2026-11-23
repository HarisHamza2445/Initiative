'use client';
/* eslint-disable @next/next/no-img-element */
import { useSite } from '@/lib/site-context';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';

const ICONS: IconName[] = ['heart', 'star', 'compass'];

export function Founder() {
  const S = useSite();
  const F = S.founder;
  return (
    <section className="sec" id="about-me" style={{ paddingTop: '40px' }}>
      <div className="wrap fd-g">
        <div className="fd-l pop">
          {F.photo ? <Photo src={F.photo} alt={F.name} className="fd-photo" /> : <img className="logo-big" src={S.logo} alt={S.name + ' logo'} />}
          <div className="fd-sig"><span className="script">{F.name}</span><small>{F.title}</small></div>
        </div>
        <div className="fd-r">
          <span className="badge rise" style={{ alignSelf: 'flex-start' }}><i></i>About me</span>
          <h2 className="h2 rise">Why I <span className="or">started.</span></h2>
          <p className="lead rise">{F.intro}</p>
          <ul className="fd-pts">{F.points.map((p, i) => <li className="rise" key={i}><span><Icon d={ICONS[i % 3]} s={18} /></span>{p}</li>)}</ul>
          <blockquote className="fd-q rise"><span className="qm">“</span>{F.quote}</blockquote>
          <p className="rise" style={{ color: 'var(--muted)', fontSize: '15px' }}>{F.promise}</p>
          <p className="script rise" style={{ fontSize: '30px', color: '#1B2A4A' }}>{F.signoff}</p>
        </div>
      </div>
    </section>
  );
}
