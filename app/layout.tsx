import type { Metadata } from "next";
import { Funnel_Sans } from "next/font/google";
import "./globals.css";

const funnel = Funnel_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://paartha.theananta.in"),
  openGraph: { images: [{ url: "/og_image.png", width: 1200, height: 630 }], siteName: "Paartha", type: "website" },
  twitter: { card: "summary_large_image", images: ["/og_image.png"] },
  title: { default: "Paartha: revise smarter, the night before and every night", template: "%s · Paartha" },
  description: "Notes, important questions, cheatsheets, flashcards and quizzes for every unit, built around your exam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={funnel.className}>{children}</body>
    </html>
  );
}
