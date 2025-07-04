import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Markora - Image Watermarking",
  description: "Secure and invisible image watermarking for your digital assets",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: '/icon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isLegalPage = pathname.includes('/privacy') || pathname.includes('/terms') || pathname.includes('/contact');

  return (
    <html lang="en">
      <body className={`${poppins.className} bg-black text-white min-h-screen`}>
        <AuthProvider>
          {!isLegalPage && <Navbar />}
          <main className={`${isLegalPage ? 'min-h-screen' : ''}`}>
            {children}
          </main>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
