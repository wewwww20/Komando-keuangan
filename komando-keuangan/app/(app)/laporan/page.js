'use client';
import { useEffect, useState } from 'react';
import { api, rp } from '@/lib/api';

export default function Laporan() {
  const [d, setD] = useState(null);
  useEffect(() => { api('/api/reports').then(setD); }, []);
  async function ekspor() {
    const { data } = await api('/api/transactions?urut=terlama');
    const csv = ['tanggal,tipe,kategori,catatan,jumlah', ...data.map((t) => [t.tanggal, t.tipe, t.kategori || '', `"${(t.catatan || '').replaceAll('"', '""')}"`, t.jumlah].join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'transaksi.csv'; a.click();
  }
  if (!d) return <p className="mute">Memuat…</p>;
  return (
    <>
      <div className="head"><div><h1>Laporan & Ekspor</h1><p>Rekap bulanan dan per kategori.</p></div>
        <div className="row noprint"><button className="btn ghost" onClick={() => print()}>Cetak / Unduh PDF</button><button className="btn" onClick={ekspor}>Ekspor CSV</button></div></div>
      <div className="grid g2">
        <div className="panel"><h2>Per bulan</h2><table><thead><tr><th>Bulan</th><th className="n">Masuk</th><th className="n">Keluar</th></tr></thead><tbody>
          {d.bulan.map((b) => <tr key={b.bulan}><td>{b.bulan}</td><td className="n in">{rp(b.masuk)}</td><td className="n out">{rp(b.keluar)}</td></tr>)}
        </tbody></table></div>
        <div className="panel"><h2>Per kategori</h2><table><thead><tr><th>Kategori</th><th>Tipe</th><th className="n">Total</th></tr></thead><tbody>
          {d.kategori.map((k, i) => <tr key={i}><td>{k.nama}</td><td>{k.tipe === 'masuk' ? 'Masuk' : 'Keluar'}</td><td className="n">{rp(k.total)}</td></tr>)}
        </tbody></table></div>
      </div>
    </>
  );
}
