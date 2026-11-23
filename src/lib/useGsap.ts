'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsoLayoutEffect } from './motion';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const release = () => document.documentElement.classList.remove('gs-wait');

/** Scroll + intro animations, ported 1:1 from the prototype. `home` adds the hero/orbit/journey timelines. */
export function useGsap(page: 'home' | 'page') {
  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    let onMove: ((e: MouseEvent) => void) | null = null;
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (page === 'home') {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.from('.hero .badge', { y: 20, opacity: 0, scale: 0.9, duration: 0.8 }, 0.1)
          .from('.hero .ln', { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.2)
          .from('.hero-fade', { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.6)
          .from('.hero-ph .hp', { y: 80, opacity: 0, duration: 1.3, stagger: 0.08 }, 0.7)
          .from('.pill-row', { y: 30, opacity: 0, duration: 1 }, 1.0);
        gsap.to('.glow', { scale: 1.15, opacity: 0.7, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.from('.hdeco .pola', { opacity: 0, scale: 0.8, y: 60, duration: 1.4, stagger: 0.15, ease: 'expo.out', delay: 0.6 });
        gsap.from('.hdeco .kite', { opacity: 0, x: 80, y: 60, duration: 2, ease: 'expo.out', delay: 1 });
        gsap.utils.toArray<HTMLElement>('.hdeco .pola').forEach((el, i) => gsap.to(el, { y: i % 2 ? 14 : -14, rotation: '+=' + (i % 2 ? 2 : -2), duration: 3.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
        gsap.to('.hdeco .kite', { rotation: 6, x: 10, y: -12, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 20%' });
        gsap.to('.hdeco .r2', { rotation: 360, duration: 120, repeat: -1, ease: 'none' });
        gsap.to('.hdeco .r3', { rotation: -360, duration: 180, repeat: -1, ease: 'none' });
        gsap.to('.hdeco', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        if (matchMedia('(pointer:fine)').matches) {
          const layers = gsap.utils.toArray<HTMLElement>('.hdeco .pola, .hdeco .kite');
          const movers = layers.map((el, i) => ({ x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }), k: (i % 2 ? 1 : -1) * (10 + i * 4) }));
          onMove = (e: MouseEvent) => { const nx = e.clientX / innerWidth - 0.5; movers.forEach((m) => m.x(nx * m.k)); };
          addEventListener('mousemove', onMove);
        }
        gsap.to('.marq-t', { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
        gsap.set('.orbit .node', { xPercent: -50, yPercent: -50, x: 0, y: 0 });
        gsap.to('.orbit .spin', { rotate: 360, duration: 40, repeat: -1, ease: 'none' });
        gsap.to('.orbit .node', { rotate: -360, duration: 40, repeat: -1, ease: 'none' });
        gsap.from('.orbit', { scale: 0.7, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.orbit', start: 'top 80%' } });
        gsap.from('.bento .bc', { y: 70, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.bento', start: 'top 80%' } });
        const path = document.querySelector<SVGPathElement>('#wavePath');
        if (path) {
          const L = path.getTotalLength();
          gsap.set(path, { strokeDasharray: L, strokeDashoffset: L });
          gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.wave-card', start: 'top 75%', end: 'bottom 60%', scrub: true } });
          gsap.from('.jn', { scale: 0, transformOrigin: 'center', duration: 0.6, stagger: 0.15, ease: 'back.out(2)', scrollTrigger: { trigger: '.wave-card', start: 'top 70%' } });
        }
        gsap.from('.cta', { y: 80, scale: 0.95, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.cta', start: 'top 88%' } });
      }
      gsap.utils.toArray<HTMLElement>('main .rise').forEach((el) => gsap.from(el, { y: 44, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
      gsap.utils.toArray<HTMLElement>('main .pop').forEach((el) => gsap.from(el, { y: 56, opacity: 0, scale: 0.98, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    release();
    return () => {
      mm.revert();
      if (onMove) removeEventListener('mousemove', onMove);
    };
  }, [page]);
}
