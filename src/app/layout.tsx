import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fmGemunu, impact } from "./fonts";
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
  title: "Quality Econ",
  description: "Advanced Level Economics Education Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fmGemunu.variable} ${impact.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
