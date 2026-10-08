import bcrypt from 'bcryptjs';
import { q } from '@/lib/db';
import { signToken, getUser, json } from '@/lib/auth';

const setCookie = (res, token, maxAge = 604800) => {
  res.headers.append('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  return res;
};

export async function GET(_, { params }) {
  if ((await params).action !== 'me') return json({ error: 'Tidak ditemukan' }, 404);
  const u = await getUser();
  return u ? json({ user: u }) : json({ error: 'Belum masuk' }, 401);
}

export async function POST(req, { params }) {
  const { action } = await params;
  if (action === 'logout') return setCookie(json({ ok: true }), '', 0);
  const { nama, email, password } = await req.json();
  if (!email || !password || password.length < 6) return json({ error: 'Email dan password (min. 6 karakter) wajib diisi.' }, 400);
  try {
    if (action === 'register') {
      const hash = await bcrypt.hash(password, 10);
      const { rows } = await q('INSERT INTO users(nama,email,password_hash) VALUES($1,$2,$3) RETURNING id,email', [nama || email, email.toLowerCase(), hash]);
      await q(`INSERT INTO categories(user_id,nama,tipe,warna) VALUES
        ($1,'Gaji','masuk','#8a9a3b'),($1,'Usaha','masuk','#c3b091'),
        ($1,'Logistik','keluar','#c8442f'),($1,'Operasional','keluar','#e0a526')`, [rows[0].id]);
      return setCookie(json({ ok: true }), signToken(rows[0]));
    }
    if (action === 'login') {
      const { rows } = await q('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
      if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash))) return json({ error: 'Email atau password salah.' }, 401);
      return setCookie(json({ ok: true }), signToken(rows[0]));
    }
  } catch (e) {
    if (e.code === '23505') return json({ error: 'Email sudah terdaftar.' }, 409);
    console.error(e); return json({ error: 'Terjadi gangguan pada server.' }, 500);
  }
  return json({ error: 'Tidak ditemukan' }, 404);
}
