import { q } from '@/lib/db';
import { guard, json } from '@/lib/auth';

export const PATCH = guard(async (req, u, { params }) => {
  const { nama, warna } = await req.json();
  await q('UPDATE categories SET nama=COALESCE($1,nama), warna=COALESCE($2,warna) WHERE id=$3 AND user_id=$4', [nama, warna, (await params).id, u.id]);
  return json({ ok: true });
});
export const DELETE = guard(async (_, u, { params }) => {
  await q('DELETE FROM categories WHERE id=$1 AND user_id=$2', [(await params).id, u.id]);
  return json({ ok: true });
});
