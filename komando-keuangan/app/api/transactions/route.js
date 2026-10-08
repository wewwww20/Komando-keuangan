import { q } from '@/lib/db';
import { guard, json } from '@/lib/auth';

export const GET = guard(async (req, u) => {
  const s = new URL(req.url).searchParams;
  const w = ['t.user_id=$1']; const p = [u.id];
  const add = (cond, v) => { p.push(v); w.push(cond.replace('?', '$' + p.length)); };
  if (s.get('tipe')) add('t.tipe=?', s.get('tipe'));
  if (s.get('kategori')) add('t.category_id=?', s.get('kategori'));
  if (s.get('dari')) add('t.tanggal>=?', s.get('dari'));
  if (s.get('sampai')) add('t.tanggal<=?', s.get('sampai'));
  if (s.get('q')) { p.push(`%${s.get('q')}%`); w.push(`(t.catatan ILIKE $${p.length} OR c.nama ILIKE $${p.length})`); }
  const order = { terbaru: 't.tanggal DESC,t.id DESC', terlama: 't.tanggal ASC,t.id ASC', terbesar: 't.jumlah DESC', terkecil: 't.jumlah ASC' }[s.get('urut')] || 't.tanggal DESC,t.id DESC';
  const sql = `SELECT t.id,t.tipe,t.jumlah::float,t.catatan,to_char(t.tanggal,'YYYY-MM-DD') tanggal,t.category_id,c.nama kategori,c.warna
    FROM transactions t LEFT JOIN categories c ON c.id=t.category_id
    WHERE ${w.join(' AND ')}
    ORDER BY ${order} LIMIT 500`;
  const { rows } = await q(sql, p);
  return json({ data: rows });
});

export const POST = guard(async (req, u) => {
  const { tipe, jumlah, catatan, tanggal, category_id } = await req.json();
  if (!['masuk', 'keluar'].includes(tipe) || !(Number(jumlah) > 0)) return json({ error: 'Tipe dan jumlah (> 0) wajib diisi.' }, 400);
  const { rows } = await q('INSERT INTO transactions(user_id,tipe,jumlah,catatan,tanggal,category_id) VALUES($1,$2,$3,$4,COALESCE($5,CURRENT_DATE),$6) RETURNING id',
    [u.id, tipe, jumlah, catatan || '', tanggal || null, category_id || null]);
  return json({ data: rows[0], message: 'Tersimpan' }, 201);
});
