import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Architects_Daughter,
} from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const architectsDaughter = Architects_Daughter({
  weight: "400", // This font only supports weight 400
  subsets: ["latin"],
  variable: "--font-architects", // Define a CSS variable name
  display: "swap",
});

export const metadata: Metadata = {
  title: "SnapPad | Your Digital Second Brain",
  description: "Capture, organize, and refine your thoughts instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${architectsDaughter.className} antialiased font-sans`}
      >
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
