
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fmGemunu, impact } from "./fonts";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quality ම Econ",
  description: "Advanced Level Economics Education Platform",
  metadataBase: new URL("https://www.krishankasthuriarachchi.lk"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png" },
    ],
    shortcut: ["/icon.png"],
  },
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
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}