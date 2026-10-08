import { q } from '@/lib/db';
import { guard, json } from '@/lib/auth';

export const GET = guard(async (req, u) => {
  const hari = Math.min(Number(new URL(req.url).searchParams.get('hari')) || 30, 365);
  const tot = await q(`SELECT
      COALESCE(SUM(jumlah) FILTER (WHERE tipe='masuk'),0)::float masuk,
      COALESCE(SUM(jumlah) FILTER (WHERE tipe='keluar'),0)::float keluar
    FROM transactions WHERE user_id=$1 AND tanggal > CURRENT_DATE - $2::int`, [u.id, hari]);
  const saldo = await q(`SELECT COALESCE(SUM(CASE WHEN tipe='masuk' THEN jumlah ELSE -jumlah END),0)::float saldo FROM transactions WHERE user_id=$1`, [u.id]);
  const seri = await q(`SELECT to_char(d,'DD/MM') label,
      COALESCE(SUM(t.jumlah) FILTER (WHERE t.tipe='masuk'),0)::float masuk,
      COALESCE(SUM(t.jumlah) FILTER (WHERE t.tipe='keluar'),0)::float keluar
    FROM generate_series(CURRENT_DATE - ($2::int - 1), CURRENT_DATE, interval '1 day') d
    LEFT JOIN transactions t ON t.tanggal = d::date AND t.user_id=$1
    GROUP BY d ORDER BY d`, [u.id, Math.min(hari, 31)]);
  return json({ ...tot.rows[0], saldo: saldo.rows[0].saldo, seri: seri.rows });
});
