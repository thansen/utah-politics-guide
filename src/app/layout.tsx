import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Utah Politics Guide",
  description: "Your guide to Utah politics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
