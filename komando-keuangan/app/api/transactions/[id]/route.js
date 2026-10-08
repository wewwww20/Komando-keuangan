import { q } from '@/lib/db';
import { guard, json } from '@/lib/auth';

export const DELETE = guard(async (_, u, { params }) => {
  await q('DELETE FROM transactions WHERE id=$1 AND user_id=$2', [(await params).id, u.id]);
  return json({ ok: true });
});
