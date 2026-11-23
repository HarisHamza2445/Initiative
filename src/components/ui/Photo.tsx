/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';
import { Icon } from './Icon';

export function Photo({ src, label, alt, style, className = '' }: { src?: string; label?: string; alt?: string; style?: CSSProperties; className?: string }) {
  return (
    <div className={'ph ' + className} style={style}>
      {src ? (
        <img src={src} alt={alt || ''} loading="lazy" />
      ) : (
        <>
          <span className="pico"><Icon d="image" s={34} w={1.4} /></span>
          <span className="plab">{label || 'Photo placeholder'}</span>
        </>
      )}
    </div>
  );
}
