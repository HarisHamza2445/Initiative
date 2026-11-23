/** Sections on the home page vs. standalone pages. The prototype used #hash for both. */
export const PAGES = ['volunteer', 'gallery', 'updates', 'admin'] as const;
export type PageId = (typeof PAGES)[number];
export const isPage = (id: string): id is PageId => (PAGES as readonly string[]).includes(id);

export const NAV: [string, string][] = [['home', 'Home'], ['about', 'About Us'], ['story', 'Our Story'], ['impact', 'Our Impact'], ['gallery', 'Gallery'], ['updates', 'Updates'], ['volunteer', 'Volunteer'], ['contact', 'Contact']];

/** Resolve a section/page id to a URL. On the home page, sections stay plain #hash links (like the prototype). */
export function hrefFor(id: string, onHome: boolean): string {
  if (isPage(id)) return '/' + id;
  if (onHome) return '#' + id;
  return id === 'home' ? '/' : '/#' + id;
}
