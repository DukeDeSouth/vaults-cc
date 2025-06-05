import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Vaults.cc - Инвестиции в искусство',
  description: 'Децентрализованная платформа для долевого владения произведениями искусства с Web3 интеграцией',
  keywords: 'NFT, искусство, инвестиции, блокчейн, Web3, долевое владение, аукционы',
  authors: [{ name: 'Vaults.cc Team' }],
  openGraph: {
    title: 'Vaults.cc - Инвестиции в искусство',
    description: 'Покупайте доли в произведениях искусства, участвуйте в аукционах и получайте доход от роста стоимости',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Vaults.cc',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaults.cc - Инвестиции в искусство',
    description: 'Децентрализованная платформа для долевого владения произведениями искусства',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>
        <div id="modal-root"></div>
      </body>
    </html>
  );
} 