import { LegalPage } from "@/components/LegalPage";

// Read from disk on every request, so replacing content/legal/terms.html (or LEGAL_CONTENT_DIR) updates the page at once.
export const dynamic = "force-dynamic";
export const metadata = { title: "Terms & Conditions", description: "The terms for using Paartha, the exam prep app.", alternates: { canonical: "/terms" } };

export default async function Terms({ searchParams }: { searchParams: Promise<{ embed?: string }> }) {
  return <LegalPage doc="terms" embed={(await searchParams).embed === "1"} />;
}
