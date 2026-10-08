'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

const NAV = [['/dashboard', 'Dasbor Keuangan', 1], ['/pemasukan', 'Catat Pemasukan', 1], ['/kategori', 'Kelola Kategori', 1],
  ['/pengeluaran', 'Catat Pengeluaran', 2], ['/riwayat', 'Riwayat Transaksi', 2], ['/laporan', 'Laporan & Ekspor', 3]];

export default function AppLayout({ children }) {
  const path = usePathname();
  const [ok, setOk] = useState(false);
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    const t = localStorage.getItem('tema') || 'dark';
    setTheme(t); document.documentElement.dataset.theme = t;
    api('/api/auth/me').then(() => setOk(true)).catch(() => (location.href = '/login'));
  }, []);
  const toggle = () => { const t = theme === 'dark' ? 'light' : 'dark'; setTheme(t); localStorage.setItem('tema', t); document.documentElement.dataset.theme = t; };
  const keluar = async () => { await api('/api/auth/logout', { method: 'POST' }); location.href = '/login'; };
  if (!ok) return <p style={{ padding: 30 }} className="mute">Memuat…</p>;
  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">★ Komando Keuangan</div>
        <nav className="nav">
          {NAV.map(([h, l, f]) => <Link key={h} href={h} className={path === h ? 'on' : ''}>{l}<small>F{f}</small></Link>)}
        </nav>
        <div className="foot">
          <button className="btn ghost sm" onClick={toggle}>{theme === 'dark' ? 'Mode terang' : 'Mode gelap'}</button>
          <button className="btn ghost sm" onClick={keluar}>Keluar</button>
        </div>
      </aside>
      <main>{children}</main>
    </div>
  );
}
