import type { Metadata } from 'next';
import './globals.css';
import { TokenProvider } from '@/context/TokenContext';

export const metadata: Metadata = {
  title: 'Solvi — Lexicon Explorer',
  description:
    'A high-fidelity academic knowledge network where every doubt becomes a node in a shared intelligence map.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ height: '100vh', overflow: 'hidden' }}>
        <TokenProvider>{children}</TokenProvider>
      </body>
    </html>
  );
}
