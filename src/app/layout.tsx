import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';

// Load Inter font for body text
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Load Poppins for headings
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'ClauseFinder - AI-Powered Contract Analysis',
  description: 'Analyze legal contracts with AI, detect risks, get plain English explanations, and compare versions',
  keywords: 'AI, legal tech, contract analysis, document review, legal document, contract management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-white to-slate-50 antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
} 