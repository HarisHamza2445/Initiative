import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/server';
import { loadApplication } from '@/lib/applications';

export const runtime = 'nodejs';

/** Signature image for one application. Admin only; signatures stay in a private bucket. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const app = await loadApplication((await params).id);
  if (!app?.png) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(Buffer.from(app.png), { headers: { 'content-type': 'image/png', 'cache-control': 'private, no-store' } });
}
