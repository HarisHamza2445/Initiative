import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/server';

/** Called by the admin portal after saving, so the public pages show the new content immediately. */
export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
