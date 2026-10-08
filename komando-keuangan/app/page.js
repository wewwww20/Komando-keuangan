import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
// Halaman pertama = login. Jika sudah punya sesi valid, langsung ke dasbor.
export default async function Home() { redirect((await getUser()) ? '/dashboard' : '/login'); }
