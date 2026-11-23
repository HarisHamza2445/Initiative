import type { Metadata } from 'next';
import { UpdatesList } from '@/components/updates/UpdatesList';
import { PageClient } from '@/components/layout/PageClient';

export const metadata: Metadata = { title: 'Updates' };

export default function UpdatesPage() {
  return (
    <main id="main" style={{ padding: '150px 0 100px' }}><div className="wrap">
      <div className="head c"><span className="badge"><i></i>Updates</span>
        <h1 className="h1" style={{ fontSize: 'clamp(38px,5.6vw,72px)' }}>Our work &amp;<br /><span className="or">where your money goes.</span></h1>
        <p className="lead" style={{ maxWidth: '620px' }}>Every drive, every session, every rupee — shared openly, so you can see exactly what your support made possible.</p>
      </div>
      <UpdatesList />
    </div><PageClient /></main>
  );
}
