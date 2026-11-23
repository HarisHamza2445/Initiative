'use client';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import { fade, spring } from '@/lib/motion';
import { Icon, Tick, type IconName } from '@/components/ui/Icon';
import { Magnetic } from '@/components/ui/Magnetic';

type Role = { id: string; n: string; label: string; title: string; where: string; icon: IconName; items: string[]; tasks: [string, string, string][]; toast: string; donate?: boolean };
const ROLES: Role[] = [
  { id: 'ground', n: '1', label: 'On-ground', title: 'Be there, in person.', where: 'Pune', icon: 'pin', items: ['Food and supply drives', 'Learning sessions with children', 'Operations and logistics'], tasks: [['Food drive', 'Saturday · Pune', 'Assigned'], ['Learning session', 'Sunday · Pune', 'Assigned']], toast: '2 missions this week' },
  { id: 'remote', n: '2', label: 'Remote', title: 'Help from anywhere.', where: 'Anywhere in the world', icon: 'laptop', items: ['Social media management and design', 'Outreach and partnerships', 'Research, writing, website and tech'], tasks: [['Design 3 Instagram posts', 'Social media', 'Assigned'], ['Reach out to 5 schools', 'Outreach', 'Assigned']], toast: '2 missions this week' },
  { id: 'donate', n: '3', label: 'Donate', title: 'Fuel the mission.', where: "Can't give time? Give support.", icon: 'gift', items: ['Meals at every drive', 'School supplies and learning kits', 'Resources for on-field volunteers'], donate: true, tasks: [['Your donation', 'Scan the QR in our Donate section', 'Any amount']], toast: 'Every rupee counts' }
];

export function Ways() {
  const [role, setRole] = useState('ground');
  const r = ROLES.find((x) => x.id === role)!;
  return (
    <section className="sec" id="join">
      <div className="wrap">
        <div className="head c"><span className="badge rise"><i></i>Ways to help</span><h2 className="h2 rise">Show up. <span className="or">Your way.</span></h2>
          <p className="lead rise" style={{ maxWidth: '560px' }}>Every volunteer commits to 2 missions a week. Tasks are assigned to you — you just bring the heart.</p></div>
        <LayoutGroup><div className="tabs" role="tablist" aria-label="Ways to help">
          {ROLES.map((x) => (
            <button key={x.id} role="tab" aria-selected={role === x.id} className={'tab' + (role === x.id ? ' on' : '')} onClick={() => setRole(x.id)}>
              {role === x.id && <motion.span layoutId="tab-pill" className="pl" transition={spring} />}<i>{x.n}</i><span>{x.label}</span>
            </button>
          ))}
        </div></LayoutGroup>
        <div className="pop"><AnimatePresence mode="wait">
          <motion.div key={r.id} role="tabpanel" className="rp" {...fade}>
            <div className="rp-l">
              <span className="pillst" style={{ alignSelf: 'flex-start', display: 'inline-flex', gap: '6px', alignItems: 'center' }}><Icon d={r.icon} s={14} />{r.where}</span>
              <h3>{r.title}</h3>
              <ul>{r.items.map((it, i) => <motion.li key={it} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}><Tick />{it}</motion.li>)}</ul>
              <div style={{ marginTop: '6px' }}>{r.donate
                ? <Magnetic className="btn btn-or" to="donate">Go to donation <Icon d="arrow" s={18} /></Magnetic>
                : <Magnetic className="btn btn-or" to="volunteer">Apply as {r.label.toLowerCase()} volunteer <Icon d="arrow" s={18} /></Magnetic>}</div>
            </div>
            <div className="rp-r" aria-hidden="true">
              <motion.span className="toast" initial={{ opacity: 0, y: -10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.35 }}><Icon d="star" s={14} c="#D4AE62" />{r.toast}</motion.span>
              {r.tasks.map(([t, s, st], i) => (
                <motion.div key={t} className="task" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
                  <div className="task-top"><b style={{ fontWeight: 600 }}>{t}</b><span className={'pillst' + (i === 0 ? ' g' : '')}>{st}</span></div><span style={{ fontSize: '13px', color: '#5E6478' }}>{s}</span>
                  {!r.donate && <div className="bar"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: i === 0 ? 0.6 : 0.25 }} transition={{ delay: 0.4 + i * 0.1, duration: 0.9 }} /></div>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence></div>
      </div>
    </section>
  );
}
