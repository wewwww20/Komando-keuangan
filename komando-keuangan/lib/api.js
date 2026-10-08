export async function api(url, opts = {}) {
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Permintaan gagal');
  return d;
}
export const rp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
