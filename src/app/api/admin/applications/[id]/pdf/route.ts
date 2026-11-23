import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/server';
import { loadApplication } from '@/lib/applications';
import { applicationPdf } from '@/lib/application-pdf';
import { getSite } from '@/lib/content';

export const runtime = 'nodejs';

/** Download one signed application as a PDF. Admin only. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const app = await loadApplication((await params).id);
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const pdf = await applicationPdf(app.row, app.png, (await getSite()).name);
  const file = `${app.row.id}-${app.row.name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'application'}.pdf`;
  return new NextResponse(Buffer.from(pdf), { headers: { 'content-type': 'application/pdf', 'content-disposition': `attachment; filename="${file}"`, 'cache-control': 'private, no-store' } });
}
