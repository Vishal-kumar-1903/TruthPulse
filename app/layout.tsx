import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TruthPulse (SatyaNews) | Multi-Agent Verified Editorial Ecosystem',
  description: 'Autonomous multi-agent verified news portal and civic editorial ecosystem with cryptographic SHA-256 seals, Observer/Investigator modes, and hyper-local routing.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark w-full max-w-full overflow-x-hidden">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-cyan-500 selection:text-white w-full max-w-full overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
