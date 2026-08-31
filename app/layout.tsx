import type { Metadata } from "next";
import { Syne, Inter, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display-src",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body-src",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-src",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.statement,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
