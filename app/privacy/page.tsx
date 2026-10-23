import { LegalPage } from "@/components/LegalPage";

// Read from disk on every request, so replacing content/legal/privacy.html (or LEGAL_CONTENT_DIR) updates the page at once.
export const dynamic = "force-dynamic";
export const metadata = { title: "Privacy Policy" };

export default async function Privacy({ searchParams }: { searchParams: Promise<{ embed?: string }> }) {
  return <LegalPage doc="privacy" embed={(await searchParams).embed === "1"} />;
}
