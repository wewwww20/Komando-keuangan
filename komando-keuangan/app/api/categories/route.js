import { q } from '@/lib/db';
import { guard, json } from '@/lib/auth';

export const GET = guard(async (_, u) => {
  const { rows } = await q(`SELECT c.*, COALESCE(SUM(t.jumlah),0)::float AS total
    FROM categories c LEFT JOIN transactions t ON t.category_id=c.id
    WHERE c.user_id=$1 GROUP BY c.id ORDER BY c.tipe, c.nama`, [u.id]);
  return json({ data: rows });
});

export const POST = guard(async (req, u) => {
  const { nama, tipe, warna } = await req.json();
  if (!nama || !['masuk', 'keluar'].includes(tipe)) return json({ error: 'Nama dan tipe kategori wajib diisi.' }, 400);
  const { rows } = await q('INSERT INTO categories(user_id,nama,tipe,warna) VALUES($1,$2,$3,$4) RETURNING *', [u.id, nama, tipe, warna || '#8a9a3b']);
  return json({ data: rows[0] }, 201);
});
