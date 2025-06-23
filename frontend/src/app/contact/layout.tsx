import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "../../context/AuthContext";
import { Analytics } from '@vercel/analytics/react';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Contact Us - Markora",
  description: "Get in touch for professional invisible watermarking services",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: '/icon.png',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-black text-white min-h-screen`}>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
} 