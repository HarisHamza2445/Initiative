import 'server-only';

type Mail = { subject: string; html: string; replyTo?: string; attachments?: { filename: string; content: string }[] };

/** Sends via Resend's HTTP API. Returns false (and logs) when not configured or on failure — never throws. */
export async function sendAdminEmail(m: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY, to = process.env.NOTIFY_EMAIL_TO, from = process.env.NOTIFY_EMAIL_FROM;
  if (!key || !to || !from) { console.warn('[email] RESEND_API_KEY / NOTIFY_EMAIL_TO / NOTIFY_EMAIL_FROM not set — skipping'); return false; }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to: to.split(',').map((s) => s.trim()), subject: m.subject, html: m.html, reply_to: m.replyTo, attachments: m.attachments })
    });
    if (!r.ok) console.error('[email] Resend error', r.status, await r.text());
    return r.ok;
  } catch (e) {
    console.error('[email] failed', e);
    return false;
  }
}

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
