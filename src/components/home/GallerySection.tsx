import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

export function GallerySection() {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}><span className="badge rise" style={{ alignSelf: 'flex-start' }}><i></i>Our work</span><h2 className="h2 rise">Moments that tell<br /><span className="or">our story.</span></h2></div>
          <SmartLink to="gallery" className="btn btn-wh rise">View full gallery <Icon d="arrow" s={18} /></SmartLink>
        </div>
        <GalleryGrid limit={6} />
      </div>
    </section>
  );
}
