import 'server-only';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import type { ApplicationRow } from './applications';

const NAVY = rgb(27 / 255, 42 / 255, 74 / 255), GOLD = rgb(168 / 255, 128 / 255, 47 / 255), MUTED = rgb(74 / 255, 81 / 255, 104 / 255), LINE = rgb(226 / 255, 215 / 255, 195 / 255);
const when = (d: string) => new Date(d).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) + ' IST';

/** A4 PDF of a signed volunteer application: every field, the terms and consent as agreed, and the signature. */
export async function applicationPdf(a: ApplicationRow, png: Uint8Array | null, orgName: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Volunteer application ${a.id} — ${a.name}`);
  doc.setAuthor(orgName);
  const reg = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  // The standard PDF fonts only cover Western characters; anything else (e.g. Devanagari) is replaced.
  const ok = new Map<string, boolean>();
  const clean = (s: string, f: PDFFont) => [...(s || '').replace(/₹/g, 'Rs ').replace(/\r/g, '')].map((ch) => {
    if (ch === '\n') return ch;
    if (!ok.has(ch)) { try { f.encodeText(ch); ok.set(ch, true); } catch { ok.set(ch, false); } }
    return ok.get(ch) ? ch : '?';
  }).join('');

  const W = 595.28, H = 841.89, M = 50, CW = W - M * 2;
  let page: PDFPage = doc.addPage([W, H]);
  let y = H - M;
  const newPage = () => { page = doc.addPage([W, H]); y = H - M; };
  const need = (h: number) => { if (y - h < M) newPage(); };
  const wrap = (text: string, f: PDFFont, size: number, width: number) => {
    const out: string[] = [];
    for (const para of clean(text, f).split('\n')) {
      let line = '';
      for (const word of para.split(/\s+/)) {
        const t = line ? line + ' ' + word : word;
        if (f.widthOfTextAtSize(t, size) <= width) line = t;
        else { if (line) out.push(line); line = word; }
      }
      out.push(line);
    }
    return out;
  };
  const text = (s: string, { f = reg, size = 11, color = NAVY, x = M, width = CW, gap = 4 } = {}) => {
    for (const l of wrap(s, f, size, width)) { need(size + gap); page.drawText(l, { x, y: y - size, size, font: f, color }); y -= size + gap; }
  };
  const rule = () => { need(14); y -= 6; page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: LINE }); y -= 10; };
  const field = (label: string, value: string) => {
    const lw = 130;
    const lines = wrap(value || '—', reg, 11, CW - lw);
    need(15 * Math.min(lines.length, 3));
    page.drawText(clean(label, bold), { x: M, y: y - 11, size: 10, font: bold, color: MUTED });
    lines.forEach((l) => { need(15); page.drawText(l, { x: M + lw, y: y - 11, size: 11, font: reg, color: NAVY }); y -= 15; });
    y -= 4;
  };

  text(orgName.toUpperCase(), { f: bold, size: 10, color: GOLD });
  text('Volunteer application', { f: bold, size: 22, gap: 8 });
  text(`Application ID ${a.id}  ·  Submitted ${when(a.submitted_at)}`, { size: 10, color: MUTED });
  rule();
  text('Applicant details', { f: bold, size: 13, gap: 8 });
  field('Full name', a.name); field('Email', a.email); field('Phone', a.phone); field('City / location', a.city);
  field('Areas of interest', a.interests.join(', ')); field('Availability', a.availability.join(', '));
  rule();
  text('Skills and experience', { f: bold, size: 11, gap: 6 }); text(a.skills, { color: MUTED }); y -= 6;
  text('Why they want to volunteer', { f: bold, size: 11, gap: 6 }); text(a.why, { color: MUTED }); y -= 6;
  if (a.extra) { text('Additional information', { f: bold, size: 11, gap: 6 }); text(a.extra, { color: MUTED }); y -= 6; }
  rule();
  text(`Volunteer terms agreed to`, { f: bold, size: 13, gap: 8 });
  a.terms.forEach((t, i) => text(`${i + 1}. ${t}`, { size: 10, color: MUTED, x: M + 8, width: CW - 8 }));
  y -= 6;
  text(`Consent: ${a.consent_agreed ? 'Agreed' : 'Not agreed'}`, { f: bold, size: 10 });
  text(a.consent_text, { size: 10, color: MUTED });
  rule();
  text('Signature', { f: bold, size: 13, gap: 8 });
  if (png) {
    const img = await doc.embedPng(png);
    const s = Math.min(260 / img.width, 90 / img.height, 1);
    need(img.height * s + 10);
    page.drawImage(img, { x: M, y: y - img.height * s, width: img.width * s, height: img.height * s });
    y -= img.height * s + 6;
  } else {
    text('Signature image unavailable.', { color: MUTED });
  }
  page.drawLine({ start: { x: M, y }, end: { x: M + 260, y }, thickness: 1, color: LINE }); y -= 4;
  text(`${a.name}  ·  ${a.signature_method === 'draw' ? 'Drawn signature' : `Typed signature: ${a.signature_typed_name}`}  ·  Signed ${when(a.signed_at)}`, { size: 9, color: MUTED });
  return doc.save();
}
