import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
export const signToken = (u) => jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
export async function getUser() {
  const t = (await cookies()).get('token')?.value;
  if (!t) return null;
  try { return jwt.verify(t, process.env.JWT_SECRET); } catch { return null; }
}
export const json = (d, status = 200) => Response.json(d, { status });
// Pembungkus: wajib login + tangkap error
export const guard = (fn) => async (req, ctx) => {
  const user = await getUser();
  if (!user) return json({ error: 'Belum masuk. Silakan login.' }, 401);
  try { return await fn(req, user, ctx); }
  catch (e) { console.error(e); return json({ error: 'Terjadi gangguan pada server.' }, 500); }
};
