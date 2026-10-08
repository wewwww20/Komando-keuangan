'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const MODUL = [['Dasbor Keuangan', 1], ['Catat Pemasukan', 1], ['Kelola Kategori', 1], ['Catat Pengeluaran', 2], ['Riwayat Transaksi', 2], ['Laporan & Ekspor', 3], ['Akun & Keamanan', 3], ['Tampilan Militer', 4]];

export default function Login() {
  const [daftar, setDaftar] = useState(false);
  const [f, setF] = useState({ nama: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [jam, setJam] = useState('');
  useEffect(() => {
    document.documentElement.dataset.theme = localStorage.getItem('tema') || 'dark';
    const t = () => setJam(new Date().toLocaleTimeString('id-ID', { hour12: false }));
    t(); const i = setInterval(t, 1000); return () => clearInterval(i);
  }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function kirim(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await api('/api/auth/' + (daftar ? 'register' : 'login'), { method: 'POST', body: f }); location.href = '/dashboard'; }
    catch (x) { setErr(x.message); setBusy(false); }
  }
  return (
    <div className="lg">
      <section className="lg-brief">
        <div className="brand" style={{ padding: 0, fontSize: '1.4rem' }}>★ Komando Keuangan</div>
        <h1>Pusat kendali kas Anda, dalam satu layar.</h1>
        <div className="panel lg-status">
          <div className="row" style={{ alignItems: 'center' }}>
            <span className="tag"><i className="dot pulse" style={{ background: 'var(--ok)' }} />Sistem siap</span>
            <span className="mute" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{jam} WIB</span>
          </div>
          <ul className="lg-mod">
            {MODUL.map(([n, p]) => <li key={n}><span>{n}</span><small>Fase {p}</small></li>)}
          </ul>
        </div>
      </section>
      <section className="lg-form">
        <form className="panel form" onSubmit={kirim}>
          <h2 style={{ fontSize: '1.4rem' }}>{daftar ? 'Daftarkan akun' : 'Masuk ke dasbor'}</h2>
          <p className="mute" style={{ margin: 0 }}>{daftar ? 'Buat akun untuk mulai mencatat kas.' : 'Gunakan email dan password terdaftar.'}</p>
          {daftar && <label>Nama<input value={f.nama} onChange={set('nama')} autoComplete="name" required /></label>}
          <label>Email<input type="email" value={f.email} onChange={set('email')} autoComplete="email" required /></label>
          <label>Password<input type="password" value={f.password} onChange={set('password')} minLength={6} autoComplete={daftar ? 'new-password' : 'current-password'} required /></label>
          {err && <div className="err" role="alert">{err}</div>}
          <button className="btn" disabled={busy}>{busy ? 'Memproses…' : daftar ? 'Daftar' : 'Masuk'}</button>
          <button type="button" className="btn ghost" onClick={() => { setDaftar(!daftar); setErr(''); }}>{daftar ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}</button>
        </form>
      </section>
    </div>
  );
}
