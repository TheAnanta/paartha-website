import type { Metadata } from "next";
import { Funnel_Sans } from "next/font/google";
import "./globals.css";
import { DESCRIPTION, KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";

const funnel = Funnel_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: "Paartha: GITAM exam prep app for notes, important questions and quizzes", template: "%s · Paartha" },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "the ananta", url: "https://theananta.in" }],
  creator: "the ananta",
  publisher: "the ananta",
  category: "education",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", url: "/", title: "Paartha: know what to study next", description: DESCRIPTION, images: [{ url: "/og_image.png", width: 1200, height: 630, alt: "Paartha, the exam prep app for GITAM engineering students" }] },
  twitter: { card: "summary_large_image", title: "Paartha: know what to study next", description: DESCRIPTION, images: ["/og_image.png"] },
  formatDetection: { telephone: false, email: false, address: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={funnel.className}>{children}</body>
    </html>
  );
}
