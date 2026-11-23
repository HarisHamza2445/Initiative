'use client';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Resize large photos in the browser before upload (max 1600px, JPEG 84%), as in the prototype. */
export async function shrink(file: File, max = 1600): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)/.test(file.type)) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const k = Math.min(1, max / Math.max(img.width, img.height));
    if (k === 1 && file.size < 900_000) return file;
    const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise<Blob>((res) => c.toBlob((b) => res(b || file), 'image/jpeg', 0.84));
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Upload to the public `media` bucket and return its public URL. Only admins can write (storage RLS). */
export async function uploadImg(sb: SupabaseClient, file: File, folder = 'uploads'): Promise<string> {
  const blob = await shrink(file);
  const ext = blob.type === 'image/jpeg' ? 'jpg' : (file.name.split('.').pop() || 'img').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from('media').upload(path, blob, { contentType: blob.type || file.type, cacheControl: '31536000', upsert: false });
  if (error) throw new Error(error.message || 'Upload failed — try again.');
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
}
