import { Footer, Header } from "@/components/Chrome";
import { type LegalDoc, readLegal } from "@/lib-legal";

type TocItem = { id: string; title: string };

/** The numbered sections of a document (`<h2 id="...">`), for the side contents list. */
function tocOf(html: string): TocItem[] {
  return [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map((m) => ({ id: m[1], title: m[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&rsquo;/g, "\u2019").replace(/&ldquo;|&rdquo;/g, "\"") }));
}

/**
 * A legal document read live from the content folder, laid out like a policy page: a contents list that stays in view beside
 * the text on wide screens. With `?embed=1` (what the app's WebView loads through `/terms.html` and `/privacy.html`) the site
 * header, footer and side list are left out.
 */
export async function LegalPage({ doc, embed }: { doc: LegalDoc; embed: boolean }) {
  const html = await readLegal(doc);
  const body = <article className="doc" dangerouslySetInnerHTML={{ __html: html }} />;
  if (embed) return <div className="embed" style={{ paddingBottom: 48 }}>{body}</div>;
  const toc = tocOf(html);
  return (
    <>
      <Header />
      <main className="legal wrap">
        <aside className="toc" aria-label="Table of contents">
          <h3>Table of contents</h3>
          <ol>
            {toc.map((t) => (
              <li key={t.id}><a href={`#${t.id}`}>{t.title}</a></li>
            ))}
          </ol>
        </aside>
        {body}
      </main>
      <Footer />
    </>
  );
}
