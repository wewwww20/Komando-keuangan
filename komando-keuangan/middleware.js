import { NextResponse } from 'next/server';
// Pemeriksaan cepat keberadaan cookie; verifikasi token sebenarnya dilakukan di API.
const PROTECTED = ['/dashboard', '/pemasukan', '/pengeluaran', '/kategori', '/riwayat', '/laporan'];
export function middleware(req) {
  const { pathname } = req.nextUrl;
  const has = req.cookies.has('token');
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !has) return NextResponse.redirect(new URL('/login', req.url));
  if (pathname === '/login' && has) return NextResponse.redirect(new URL('/dashboard', req.url));
  return NextResponse.next();
}
export const config = { matcher: ['/login', '/dashboard/:path*', '/pemasukan/:path*', '/pengeluaran/:path*', '/kategori/:path*', '/riwayat/:path*', '/laporan/:path*'] };
