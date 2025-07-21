import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Greenville Chamber Music Society",
  description: "Experience world-class chamber music performances in Greenville. Join us for intimate concerts featuring renowned artists and emerging talents.",
  icons: {
    icon: [
      { url: `${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/gcms-favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/gcms-favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
    ],
    shortcut: `${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/gcms-favicon.ico`,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
