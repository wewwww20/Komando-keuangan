import './globals.css';
import { Chakra_Petch, IBM_Plex_Sans } from 'next/font/google';
const head = Chakra_Petch({ subsets: ['latin'], weight: ['500', '700'], variable: '--f-head' });
const body = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-body' });
export const metadata = { title: 'Komando Keuangan', description: 'Pusat kendali keuangan pribadi dan usaha', icons: { icon: '/favicon.svg' } };
export default function Root({ children }) {
  return (
    <html lang="id" className={`${head.variable} ${body.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
