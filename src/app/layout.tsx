import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ventixe - Event Management & Collegiate MNC Platform',
  description:
    'Discover world-class university hackathons, certifications, and career summits hosted by Google, Microsoft, Meta, NVIDIA, Amazon, Apple, Goldman Sachs & Tesla. Instant student passes and real-time gate scanner.',
  keywords: [
    'Ventixe',
    'student events',
    'MNC hackathons',
    'Google campus hackathon',
    'Microsoft Azure summit',
    'NVIDIA DLI masterclass',
    'internship fair',
    'QR code student tickets',
  ],
  authors: [{ name: 'Ventixe Platform' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8f9fe] text-slate-800 selection:bg-rose-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
