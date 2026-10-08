'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function TrxForm({ tipe }) {
  const [cats, setCats] = useState([]);
  const [f, setF] = useState({ jumlah: '', catatan: '', tanggal: new Date().toISOString().slice(0, 10), category_id: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => { api('/api/categories').then((d) => setCats(d.data.filter((c) => c.tipe === tipe))); }, [tipe]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function simpan(e) {
    e.preventDefault();
    try {
      await api('/api/transactions', { method: 'POST', body: { ...f, tipe } });
      setMsg(tipe === 'masuk' ? 'Pemasukan tersimpan' : 'Pengeluaran tersimpan');
      setF({ ...f, jumlah: '', catatan: '' });
    } catch (x) { setMsg(x.message); }
    setTimeout(() => setMsg(''), 2500);
  }
  return (
    <form className="panel form" onSubmit={simpan}>
      <label>Jumlah (Rp)<input type="number" min="1" step="any" value={f.jumlah} onChange={set('jumlah')} required /></label>
      <div className="row">
        <label>Kategori<select value={f.category_id} onChange={set('category_id')}><option value="">Tanpa kategori</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}</select></label>
        <label>Tanggal<input type="date" value={f.tanggal} onChange={set('tanggal')} /></label>
      </div>
      <label>Catatan<textarea rows="2" value={f.catatan} onChange={set('catatan')} /></label>
      <button className="btn">{tipe === 'masuk' ? 'Simpan pemasukan' : 'Simpan pengeluaran'}</button>
      {msg && <div className="toast" role="status">{msg}</div>}
    </form>
  );
}
