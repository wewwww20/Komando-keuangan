# Komando Keuangan
Next.js 15 (App Router) + Node.js route handlers + PostgreSQL.

## Struktur
- `app/api/*`  → API publik untuk frontend (auth, categories, transactions, dashboard, reports)
- `app/(app)/*` → halaman terlindungi (dasbor, pemasukan, pengeluaran, kategori, riwayat, laporan)
- `app/login`  → masuk / daftar
- `lib/` (db, auth, api client), `components/`, `db/schema.sql`, `public/`, `vercel.json`

## Jalankan
1. `cp .env.example .env.local` lalu isi `DATABASE_URL` dan `JWT_SECRET`
2. `npm install`
3. `npm run db:init` (jalankan dengan env terisi: `export $(cat .env.local | xargs)`)
4. `npm run dev` → http://localhost:3000

## Deploy ke Vercel
Impor repo, isi env `DATABASE_URL`, `PGSSL=1`, `JWT_SECRET`. Jalankan `db/schema.sql` sekali di database Anda.
