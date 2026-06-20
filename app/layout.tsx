import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weight Loss Monitor",
  description: "Personal weight tracking — built around the chart.",
  applicationName: "Weight Loss Monitor",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Weight Loss Monitor",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
