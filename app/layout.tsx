import type { Metadata, Viewport } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TARE — Personal Mass Instrument",
  description: "Track the trend, not the noise. Weigh in once a day — we draw the line.",
  applicationName: "TARE",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TARE",
  },
};

export const viewport: Viewport = {
  themeColor: "#080907",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
