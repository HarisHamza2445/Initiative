import type { Metadata } from 'next';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { PageClient } from '@/components/layout/PageClient';

export const metadata: Metadata = { title: 'Gallery' };

export default function GalleryPage() {
  return (
    <main id="main" style={{ padding: '140px 0 100px' }}><div className="wrap">
      <div className="head c"><span className="badge"><i></i>Gallery</span><h1 className="h1" style={{ fontSize: 'clamp(38px,5.6vw,72px)' }}>Our work,<br /><span className="or">in pictures.</span></h1><p className="lead" style={{ maxWidth: '560px' }}>Moments from our drives, sessions and community work. Tap any photo to view it full size.</p></div>
      <GalleryGrid filters />
    </div><PageClient /></main>
  );
}
