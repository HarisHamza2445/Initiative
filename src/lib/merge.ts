import { SITE, DEFAULT_LOGO, type Site } from './site-defaults';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);

/** Deep-merge saved content over defaults. Arrays and scalars from `b` replace those in `a`. */
export function merge<T>(a: T, b: unknown): T {
  if (!isObj(a)) return (b === undefined ? a : b) as T;
  if (!isObj(b)) return a;
  const o: Obj = { ...(a as Obj) };
  for (const k of Object.keys(b)) {
    const av = (a as Obj)[k], bv = b[k];
    o[k] = isObj(av) && isObj(bv) ? merge(av, bv) : bv;
  }
  return o as T;
}

/** Older content (from the prototype) used relative `img/…` paths; make them root-relative. */
export const fixSrc = (s: string | undefined | null) => (s && /^img\//.test(s) ? '/' + s : s || '');

export function normalizeSite(saved: unknown): Site {
  const s = merge(SITE, saved);
  return {
    ...s,
    logo: fixSrc(s.logo) || DEFAULT_LOGO,
    founder: { ...s.founder, photo: fixSrc(s.founder.photo) },
    gallery: (s.gallery || []).map((g) => ({ ...g, src: fixSrc(g.src) })),
    updates: (s.updates || []).map((u) => ({ ...u, breakdown: u.breakdown || [], photos: (u.photos || []).map((p) => fixSrc(p)) })),
    donation: { ...s.donation, qrImage: fixSrc(s.donation.qrImage) }
  };
}
