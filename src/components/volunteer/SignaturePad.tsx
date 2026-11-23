'use client';
import { useEffect, useRef, type PointerEvent } from 'react';

export function SignaturePad({ onChange }: { onChange: (dataUrl: string) => void }) {
  const cv = useRef<HTMLCanvasElement>(null), drawing = useRef(false), last = useRef<{ x: number; y: number } | null>(null), has = useRef(false);
  useEffect(() => {
    const c = cv.current!, r = c.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = r.width * dpr; c.height = r.height * dpr;
    const ctx = c.getContext('2d')!; ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1B2A4A'; ctx.lineWidth = 2.4;
  }, []);
  const pos = (e: PointerEvent) => { const r = cv.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const down = (e: PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault(); cv.current!.setPointerCapture(e.pointerId); drawing.current = true; last.current = pos(e);
    const ctx = cv.current!.getContext('2d')!; ctx.beginPath(); ctx.arc(last.current.x, last.current.y, 1.1, 0, Math.PI * 2); ctx.fillStyle = '#1B2A4A'; ctx.fill();
  };
  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const p = pos(e), ctx = cv.current!.getContext('2d')!;
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last.current = p; has.current = true;
  };
  const up = () => { if (!drawing.current) return; drawing.current = false; if (has.current) onChange(cv.current!.toDataURL('image/png')); };
  const clear = () => { const c = cv.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height); has.current = false; onChange(''); };
  return (
    <div className="stack" style={{ gap: '10px' }}>
      <div className="sigpad"><canvas ref={cv} role="img" aria-label="Signature pad: draw your signature with a mouse, trackpad, pen or finger" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}></canvas><span className="base"></span><span className="hnt">Sign above the line</span></div>
      <div><button type="button" className="btn btn-wh btn-sm" onClick={clear}>Clear signature</button></div>
    </div>
  );
}

export function typedToImage(text: string) {
  const c = document.createElement('canvas'); c.width = 900; c.height = 240;
  const ctx = c.getContext('2d')!; ctx.fillStyle = '#1B2A4A'; ctx.font = '600 92px Caveat, cursive'; ctx.textBaseline = 'middle'; ctx.fillText(text, 30, 120, 840);
  return c.toDataURL('image/png');
}
