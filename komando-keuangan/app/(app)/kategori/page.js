'use client';
import { useEffect, useState } from 'react';
import { api, rp } from '@/lib/api';

export default function Kategori() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ nama: '', tipe: 'keluar', warna: '#8a9a3b' });
  const muat = () => api('/api/categories').then((d) => setRows(d.data));
  useEffect(() => { muat(); }, []);
  const tambah = async (e) => { e.preventDefault(); await api('/api/categories', { method: 'POST', body: f }); setF({ ...f, nama: '' }); muat(); };
  const hapus = async (id) => { if (confirm('Hapus kategori ini? Transaksi tetap tersimpan tanpa kategori.')) { await api('/api/categories/' + id, { method: 'DELETE' }); muat(); } };
  return (
    <>
      <div className="head"><div><h1>Kelola Kategori</h1><p>Atur kelompok, warna, dan lihat total per kategori.</p></div></div>
      <form className="panel row" onSubmit={tambah}>
        <label>Nama<input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} required /></label>
        <label>Tipe<select value={f.tipe} onChange={(e) => setF({ ...f, tipe: e.target.value })}><option value="masuk">Pemasukan</option><option value="keluar">Pengeluaran</option></select></label>
        <label style={{ maxWidth: 90, minWidth: 80 }}>Warna<input type="color" value={f.warna} onChange={(e) => setF({ ...f, warna: e.target.value })} /></label>
        <button className="btn">Buat kategori</button>
      </form>
      <div className="panel" style={{ marginTop: 14 }}>
        <table><thead><tr><th>Kategori</th><th>Tipe</th><th className="n">Total</th><th /></tr></thead><tbody>
          {rows.map((c) => (
            <tr key={c.id}><td><span className="tag"><i className="dot" style={{ background: c.warna }} />{c.nama}</span></td>
              <td>{c.tipe === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}</td><td className="n">{rp(c.total)}</td>
              <td className="n"><button className="btn ghost sm" onClick={() => hapus(c.id)}>Hapus</button></td></tr>
          ))}
          {!rows.length && <tr><td colSpan="4" className="mute">Belum ada kategori. Buat yang pertama di atas.</td></tr>}
        </tbody></table>
      </div>
    </>
  );
}
