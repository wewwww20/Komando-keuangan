'use client';
import { useEffect, useState } from 'react';
import { api, rp } from '@/lib/api';

export default function Riwayat() {
  const [f, setF] = useState({ q: '', tipe: '', dari: '', sampai: '', urut: 'terbaru' });
  const [rows, setRows] = useState([]);
  const muat = () => api('/api/transactions?' + new URLSearchParams(Object.entries(f).filter(([, v]) => v))).then((d) => setRows(d.data));
  useEffect(() => { const t = setTimeout(muat, 250); return () => clearTimeout(t); }, [f]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const hapus = async (id) => { if (confirm('Hapus transaksi ini?')) { await api('/api/transactions/' + id, { method: 'DELETE' }); muat(); } };
  return (
    <>
      <div className="head"><div><h1>Riwayat Transaksi</h1><p>Cari, saring, dan urutkan catatan kas.</p></div></div>
      <div className="panel row">
        <label>Cari<input placeholder="Catatan atau kategori" value={f.q} onChange={set('q')} /></label>
        <label>Tipe<select value={f.tipe} onChange={set('tipe')}><option value="">Semua</option><option value="masuk">Pemasukan</option><option value="keluar">Pengeluaran</option></select></label>
        <label>Dari<input type="date" value={f.dari} onChange={set('dari')} /></label>
        <label>Sampai<input type="date" value={f.sampai} onChange={set('sampai')} /></label>
        <label>Urutan<select value={f.urut} onChange={set('urut')}><option value="terbaru">Terbaru</option><option value="terlama">Terlama</option><option value="terbesar">Terbesar</option><option value="terkecil">Terkecil</option></select></label>
      </div>
      <div className="panel" style={{ marginTop: 14, overflowX: 'auto' }}>
        <table><thead><tr><th>Tanggal</th><th>Kategori</th><th>Catatan</th><th className="n">Jumlah</th><th /></tr></thead><tbody>
          {rows.map((t) => (
            <tr key={t.id}><td>{t.tanggal}</td>
              <td><span className="tag"><i className="dot" style={{ background: t.warna || 'var(--mute)' }} />{t.kategori || '-'}</span></td>
              <td>{t.catatan}</td><td className={'n ' + (t.tipe === 'masuk' ? 'in' : 'out')}>{t.tipe === 'masuk' ? '+' : '-'}{rp(t.jumlah)}</td>
              <td className="n"><button className="btn ghost sm" onClick={() => hapus(t.id)}>Hapus</button></td></tr>
          ))}
          {!rows.length && <tr><td colSpan="5" className="mute">Tidak ada transaksi yang cocok.</td></tr>}
        </tbody></table>
      </div>
    </>
  );
}
