import type { Metadata } from "next";
import { Funnel_Sans } from "next/font/google";
import "./globals.css";

const funnel = Funnel_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
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
