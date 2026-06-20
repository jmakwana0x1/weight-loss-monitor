import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weight Loss Monitor",
  description: "Personal weight tracking — built around the chart.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
