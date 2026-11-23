import { Icon, PATHS, type IconName } from '@/components/ui/Icon';

const JOURNEY = [
  { x: 60, y: 120, up: true, t: 'Food', tag: 'Meals at drives' }, { x: 230, y: 230, up: false, t: 'Education', tag: 'Learning sessions' },
  { x: 400, y: 120, up: true, t: 'Support', tag: 'Someone to talk to' }, { x: 570, y: 230, up: false, t: 'Guidance', tag: 'Mentor sessions' },
  { x: 740, y: 120, up: true, t: 'Pathway', tag: 'A step-by-step plan' }, { x: 880, y: 230, up: false, t: 'Dream', tag: 'Within reach', gold: true }
];
const JICON: IconName[] = ['food', 'book', 'heart', 'compass', 'rocket', 'star'];
const WAVE = 'M60 120 C 145 120, 145 230, 230 230 S 315 120, 400 120 S 485 230, 570 230 S 655 120, 740 120 S 830 230, 880 230';

export function Journey() {
  return (
    <section className="sec" id="journey" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}><span className="eyebrow rise">The journey</span><h2 className="h2 rise">One path.<br />Every child walks it.</h2></div>
          <p className="lead rise" style={{ maxWidth: '360px', fontSize: '16px' }}>Each step builds on the last — from a full plate to a clear plan for the future.</p>
        </div>
        <div className="wave-card pop">
          <div className="wave-top"><div className="who"><span className="av">A</span><div style={{ display: 'flex', flexDirection: 'column' }}><b style={{ fontWeight: 600 }}>Every child we meet</b><span style={{ fontSize: '13px', color: '#B9C0D3' }}>Example journey</span></div></div>
            <div style={{ display: 'flex', gap: '6px' }}>{JICON.map((ic) => <span key={ic} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #33467A', background: '#22325A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={ic} s={16} c="#E2C27D" /></span>)}</div></div>
          <div className="wave-scroll"><div className="wave-inner">
            <svg className="wave-svg" viewBox="0 0 940 330" role="img" aria-label="Journey: Food, Education, Support, Guidance, Pathway, Dream">
              <path d={WAVE} fill="none" stroke="#E9DFCB" strokeWidth="3" />
              <path id="wavePath" d={WAVE} fill="none" stroke="#A8802F" strokeWidth="3" strokeLinecap="round" />
              {JOURNEY.map((j, i) => (
                <g key={j.t} className="jn">
                  <circle cx={j.x} cy={j.y} r="22" fill={j.gold ? '#A8802F' : '#fff'} stroke="#A8802F" strokeWidth="2" />
                  <g transform={`translate(${j.x - 10} ${j.y - 10}) scale(0.84)`}><path d={PATHS[JICON[i]]} fill="none" stroke={j.gold ? '#fff' : '#A8802F'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g>
                  <text x={j.x} y={j.up ? j.y - 40 : j.y + 48} textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="16" fill="#1B2A4A">{j.t}</text>
                  <g transform={`translate(${j.x} ${j.up ? j.y - 82 : j.y + 66})`}><rect x="-68" y="0" width="136" height="26" rx="13" fill={j.gold ? '#1B2A4A' : '#F6F0E6'} stroke={j.gold ? '#1B2A4A' : '#E2D7C3'} /><text x="0" y="17" textAnchor="middle" fontFamily="Poppins" fontSize="12" fontWeight="500" fill={j.gold ? '#fff' : '#4A5168'}>{j.tag}</text></g>
                </g>
              ))}
            </svg>
          </div></div>
          <ol className="jlist" aria-label="Journey steps">
            {JOURNEY.map((j, i) => (
              <li key={j.t} className={j.gold ? 'gold' : undefined}>
                <span className="jc"><Icon d={JICON[i]} s={18} /></span>
                <div><b>{j.t}</b><span>{j.tag}</span></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
