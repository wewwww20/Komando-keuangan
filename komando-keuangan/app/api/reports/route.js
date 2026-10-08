import { q } from '@/lib/db';
import { guard, json } from '@/lib/auth';

// Laporan berkala: ringkasan per bulan + per kategori
export const GET = guard(async (_, u) => {
  const bulan = await q(`SELECT to_char(date_trunc('month',tanggal),'YYYY-MM') bulan,
      SUM(jumlah) FILTER (WHERE tipe='masuk')::float masuk,
      SUM(jumlah) FILTER (WHERE tipe='keluar')::float keluar
    FROM transactions WHERE user_id=$1 GROUP BY 1 ORDER BY 1 DESC LIMIT 12`, [u.id]);
  const kat = await q(`SELECT COALESCE(c.nama,'Tanpa kategori') nama, t.tipe, SUM(t.jumlah)::float total
    FROM transactions t LEFT JOIN categories c ON c.id=t.category_id
    WHERE t.user_id=$1 GROUP BY 1,2 ORDER BY total DESC`, [u.id]);
  return json({ bulan: bulan.rows, kategori: kat.rows });
});
