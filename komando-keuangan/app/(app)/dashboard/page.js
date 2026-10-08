'use client';
import { useEffect, useState } from 'react';
import { api, rp } from '@/lib/api';

export default function Dasbor() {
  const [hari, setHari] = useState(30);
  const [d, setD] = useState(null);
  useEffect(() => { api('/api/dashboard?hari=' + hari).then(setD); }, [hari]);
  if (!d) return <p className="mute">Memuat…</p>;
  const max = Math.max(1, ...d.seri.flatMap((s) => [s.masuk, s.keluar]));
  const w = 700 / d.seri.length;
  return (
    <>
      <div className="head"><div><h1>Dasbor Keuangan</h1><p>Posisi kas {hari} hari terakhir.</p></div>
        <select style={{ width: 160 }} value={hari} onChange={(e) => setHari(+e.target.value)} aria-label="Periode">
          <option value="7">7 hari</option><option value="30">30 hari</option><option value="90">90 hari</option><option value="365">1 tahun</option>
        </select></div>
      <div className="grid g3">
        <div className="panel stat"><span className="mute">Saldo kas</span><b>{rp(d.saldo)}</b></div>
        <div className="panel stat"><span className="mute">Uang masuk</span><b className="in">{rp(d.masuk)}</b></div>
        <div className="panel stat"><span className="mute">Uang keluar</span><b className="out">{rp(d.keluar)}</b></div>
      </div>
      <div className="panel" style={{ marginTop: 14 }}>
        <h2>Grafik uang masuk dan keluar</h2>
        <svg viewBox="0 0 700 220" style={{ width: '100%', marginTop: 10 }} role="img" aria-label="Grafik batang harian">
          {d.seri.map((s, i) => (
            <g key={i} transform={`translate(${i * w},0)`}>
              <rect x={w * 0.1} width={w * 0.38} y={200 - (s.masuk / max) * 190} height={(s.masuk / max) * 190} fill="var(--ok)" rx="2" />
              <rect x={w * 0.52} width={w * 0.38} y={200 - (s.keluar / max) * 190} height={(s.keluar / max) * 190} fill="var(--red)" rx="2" />
              {(d.seri.length <= 10 || i % Math.ceil(d.seri.length / 8) === 0) && <text x={w / 2} y="216" fontSize="10" textAnchor="middle" fill="var(--mute)">{s.label}</text>}
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}
