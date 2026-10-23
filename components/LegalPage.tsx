import { Footer, Header } from "@/components/Chrome";
import { type LegalDoc, readLegal } from "@/lib-legal";

/**
 * A legal document read live from the content folder. With `?embed=1` (what the app's WebView loads through
 * `/terms.html` and `/privacy.html`) the site header and footer are left out.
 */
export async function LegalPage({ doc, embed }: { doc: LegalDoc; embed: boolean }) {
  const html = await readLegal(doc);
  const body = <article className="doc" dangerouslySetInnerHTML={{ __html: html }} />;
  if (embed) return <div style={{ paddingBottom: 48 }}>{body}</div>;
  return (
    <>
      <Header />
      <main>{body}</main>
      <Footer />
    </>
  );
}
