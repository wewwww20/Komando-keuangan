CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('masuk','keluar')),
  warna TEXT NOT NULL DEFAULT '#8a9a3b'
);
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('masuk','keluar')),
  jumlah NUMERIC(15,2) NOT NULL CHECK (jumlah > 0),
  catatan TEXT DEFAULT '',
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_trx_user_tgl ON transactions(user_id, tanggal DESC);
