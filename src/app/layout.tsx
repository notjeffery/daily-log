import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Logistics — Move Anything. Everywhere.",
  description:
    "Daily Logistics delivers packages from your doorstep to any destination worldwide — fast, tracked, and reliably handled every step of the way.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}