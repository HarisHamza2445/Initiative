'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { tap } from '@/lib/motion';
import { Icon, Tick } from '@/components/ui/Icon';

const NODES: [string, number, number][] = [['Education', 50, 0], ['Food', 97, 35], ['Support', 79, 90], ['Guidance', 21, 90], ['Dreams', 3, 35]];
const DREAMS = ['Doctor', 'Engineer', 'Teacher', 'Artist', 'Athlete', 'Pilot'];

export function WhatWeDo() {
  const [dream, setDream] = useState('Doctor');
  return (
    <section className="dark sec" id="what">
      <div className="wrap">
        <div className="orbit-wrap">
          <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span className="badge dk rise" style={{ alignSelf: 'flex-start' }}><i></i>What we do</span>
            <h2 className="h2 rise" style={{ fontSize: 'clamp(36px,5.4vw,68px)' }}>Educate. Feed.<br />Heal. Guide.<br /><span className="or">Dream.</span></h2>
            <p className="lead rise" style={{ maxWidth: '440px' }}>Five kinds of support that build on each other — so every child gets everything they need to move forward.</p>
          </div>
          <div className="orbit" aria-hidden="true">
            <div className="ring"></div><div className="ring r2"></div>
            <div className="core"><Icon d="star" s={54} c="#fff" w={1.6} /></div>
            <div className="spin">{NODES.map(([t, x, y], i) => <span key={t} className="node" style={{ left: x + '%', top: y + '%' }}><i>{i + 1}</i>{t}</span>)}</div>
          </div>
        </div>
        <div className="bento">
          <div className="bc"><span className="k"><i>1</i>Education</span><h3>Learning that doesn’t stop.</h3><p>Regular learning sessions, study help and the basic school supplies every child needs.</p>
            <div className="mock"><div className="mrow"><span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><Icon d="book" s={18} c="#A8802F" /><b>Learning session</b></span><span className="pillst">This weekend</span></div><div className="mrow"><span>Notebooks &amp; stationery kit</span><Tick /></div></div></div>
          <div className="bc"><span className="k"><i>2</i>Food</span><h3>No one learns hungry.</h3><p>Nutritious meals through food drives run by our on-ground volunteers.</p>
            <div className="mock"><div className="mrow"><b>Food drive · Pune</b><span className="pillst g">Volunteers assigned</span></div><div className="mrow"><span>Meal packing</span><Tick /></div><div className="mrow"><span>Distribution</span><Tick /></div></div></div>
          <div className="bc"><span className="k"><i>3</i>Psychological help</span><h3>Someone to talk to.</h3><p>A safe space to share, heal and build the confidence to believe in themselves.</p>
            <div className="mock" style={{ gap: '8px' }}><span className="bub a">You can talk to us about anything.</span><span className="bub b">Can we talk after the session?</span><span className="bub a">Of course. We’re here.</span></div></div>
          <div className="bc"><span className="k"><i>4</i>Career guidance &amp; dreams</span><h3>“I want to be…” becomes a plan.</h3><p>Mentors help each child pick a dream and map the steps to reach it.</p>
            <div className="mock"><span style={{ fontSize: '13px', color: '#5E6478' }}>Tap a dream</span>
              <div className="dchips">{DREAMS.map((d) => <motion.button key={d} type="button" whileTap={tap} className={'dchip' + (dream === d ? ' on' : '')} style={{ font: 'inherit', fontSize: '14px', cursor: 'pointer', minHeight: '40px' }} aria-pressed={dream === d} onClick={() => setDream(d)}>{d}</motion.button>)}</div>
              <AnimatePresence mode="wait"><motion.div key={dream} className="mrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><span>Pathway to <b>{dream}</b></span><span className="pillst g">Mentor matched</span></motion.div></AnimatePresence>
            </div></div>
        </div>
      </div>
    </section>
  );
}
