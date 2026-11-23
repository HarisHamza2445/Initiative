import { Icon } from '@/components/ui/Icon';
import { Magnetic } from '@/components/ui/Magnetic';

export function CTA() {
  return (
    <section className="wrap" style={{ paddingBottom: '20px' }}>
      <div className="cta"><div className="glow2" aria-hidden="true"></div>
        <span className="badge dk"><i></i>Students · Professionals · Creatives</span>
        <h2 className="h2" style={{ fontSize: 'clamp(36px,6vw,76px)' }}>Let’s create change<br /><span className="or">together.</span></h2>
        <p className="lead" style={{ maxWidth: '520px' }}>Two missions a week can change what a child believes is possible.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}><Magnetic className="btn btn-or" strength={0.4} to="volunteer">Apply to volunteer <Icon d="arrow" s={18} /></Magnetic><Magnetic className="btn btn-wh" to="donate">Donate now</Magnetic></div>
      </div>
    </section>
  );
}
