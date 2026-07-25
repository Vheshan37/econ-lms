import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fmGemunu, impact, rubikDoodle, sinhalaFont } from "./fonts";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import PwaInstallProvider from "@/components/pwa/PwaInstallProvider";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import DynamicManifest from "@/components/pwa/DynamicManifest";

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
      { url: "/favicon.jpg" },
      { url: "/favicon.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/favicon.jpg", sizes: "16x16", type: "image/jpeg" },
    ],
    apple: [{ url: "/favicon.jpg" }],
    shortcut: ["/favicon.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${fmGemunu.variable} 
          ${impact.variable} 
          ${rubikDoodle.variable} 
          ${sinhalaFont.variable} 
          antialiased`}
      >
        <PwaInstallProvider>
          <DynamicManifest />
          <ServiceWorkerRegister />
          <SmoothScroll>{children}</SmoothScroll>
        </PwaInstallProvider>
      </body>
    </html>
  );
}
