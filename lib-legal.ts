import { readFile } from "node:fs/promises";
import path from "node:path";

export type LegalDoc = "terms" | "privacy";

export const LEGAL_TITLES: Record<LegalDoc, string> = { terms: "Terms & Conditions", privacy: "Privacy Policy" };

/** The document's HTML, read from disk on every (revalidated) request so replacing the file updates the site. */
export async function readLegal(doc: LegalDoc): Promise<string> {
  const dir = process.env.LEGAL_CONTENT_DIR || path.join(process.cwd(), "content", "legal");
  return readFile(path.join(dir, `${doc}.html`), "utf8");
}
