'use client';
/* eslint-disable @next/next/no-img-element */
import { useSite } from '@/lib/site-context';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Line } from '@/components/ui/Line';
import { Magnetic } from '@/components/ui/Magnetic';
import { Photo } from '@/components/ui/Photo';

const PILLS: [IconName, string][] = [['book', 'Education'], ['food', 'Nutritious food'], ['heart', 'Psychological help'], ['compass', 'Career guidance'], ['rocket', 'A pathway to dreams'], ['star', 'School supplies'], ['heart', 'Mentorship']];
const SPARKS = [[8, 18, 14, 0], [16, 62, 10, 1.2], [26, 34, 8, 2.1], [72, 22, 12, 0.6], [84, 58, 9, 1.7], [91, 30, 14, 2.6], [60, 12, 8, 3.1], [38, 14, 9, 0.9], [12, 84, 11, 2.4], [88, 82, 10, 1.4], [50, 6, 12, 1.9], [22, 48, 7, 3.4], [78, 44, 7, 0.3]];
const POLAS = [['/img/gifts.jpg', 'Every dream matters.', 'pl1'], ['/img/meal-2.jpg', 'Every hand helps.', 'pl2'], ['/img/rakhi.jpg', 'Every future is bright.', 'pl3'], ['/img/festival-kits.jpg', 'Made with love.', 'pl4']];

export function Hero() {
  const S = useSite();
  return (
    <section className="hero" id="home">
      <div className="glow" aria-hidden="true"></div><div className="dots" aria-hidden="true"></div>
      <div className="hdeco" aria-hidden="true">
        <span className="ring r1"></span><span className="ring r2"></span><span className="ring r3"></span>
        {SPARKS.map(([x, y, sz, dl], i) => (
          <svg key={i} className="spark" style={{ left: x + '%', top: y + '%', width: sz * 2 + 'px', height: sz * 2 + 'px', animationDelay: dl + 's' }} viewBox="0 0 24 24"><path d="M12 1c.9 6.6 2.4 8.1 11 11-8.6 2.9-10.1 4.4-11 11-.9-6.6-2.4-8.1-11-11 8.6-2.9 10.1-4.4 11-11z" fill="#C49A4A" /></svg>
        ))}
        {POLAS.map(([src, cap, c]) => <figure key={c} className={'pola ' + c}><span className="pin"></span><img src={src} alt="" loading="eager" /><figcaption className="script">{cap}</figcaption></figure>)}
        <svg className="kite" viewBox="0 0 120 220"><path d="M60 4 L92 44 L60 92 L28 44 Z" fill="#1B2A4A" /><path d="M60 4 L92 44 L60 44 Z" fill="#C49A4A" /><path d="M28 44 L60 92 L60 44 Z" fill="#D4AE62" /><path d="M60 92 C 48 120, 78 136, 62 164 C 50 186, 72 198, 64 216" stroke="#1B2A4A" strokeWidth="1.6" fill="none" strokeDasharray="3 4" /><path d="M56 118 l8 -4 -2 9z M60 150 l8 -3 -3 8z M58 184 l8 -3 -3 8z" fill="#C49A4A" /></svg>
      </div>
      <div className="wrap hero-c">
        <span className="badge"><i></i>Youth-led · Pune &amp; remote · Now recruiting</span>
        <h1 className="h1"><Line>Together, we can</Line><Line cls="or">make a difference.</Line></h1>
        <p className="lead hero-fade">We’re committed to creating positive change in children’s lives — through education, food, psychological help and career guidance, and a real pathway to the dreams they choose.</p>
        <div className="hero-fade" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Magnetic className="btn btn-or" to="donate">Donate now <Icon d="arrow" s={18} /></Magnetic>
          <Magnetic className="btn btn-wh" to="volunteer">Become a volunteer</Magnetic>
        </div>
        <a className="play hero-fade" href={S.contact.instagram.url}><i><svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z" fill="#fff" /></svg></i>See our work on Instagram</a>
      </div>
      <div className="hero-ph" aria-label="Photos from our drives">
        {S.gallery.filter((g) => g.src).slice(0, 5).map((g, i) => <Photo key={g.src} className={'hp hp' + i} src={g.src} alt={g.caption} />)}
      </div>
      <div className="pill-row">
        <span className="eyebrow">What every child gets</span>
        <div className="marq"><div className="marq-t">{[0, 1].map((k) => (
          <span key={k} aria-hidden={k === 1}>{PILLS.map(([ic, t], i) => <span className="mp" key={i}><Icon d={ic} s={18} c="#A8802F" />{t}</span>)}</span>
        ))}</div></div>
      </div>
    </section>
  );
}
