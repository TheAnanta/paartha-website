// Writes self-contained copies of the legal pages into the Flutter app (assets/legal/), used when the website can't be reached.
// The website (content/legal/*.html) is the single source of truth. Run after editing it:
//   node scripts/export-app-legal.mjs [path/to/paartha/assets/legal]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] ?? path.join(root, "..", "..", "..", "flutter", "projects", "paartha", "assets", "legal");
mkdirSync(out, { recursive: true });

const css = `
:root{color-scheme:light}
body{font-family:-apple-system,"Funnel Sans","Helvetica Neue",Arial,sans-serif;color:#1d1b20;background:#fff;margin:0;padding:20px 20px 56px;line-height:1.6;max-width:760px}
h1{font-size:28px;line-height:1.15;letter-spacing:-.6px;margin:4px 0 6px}
h2{font-size:20px;margin:36px 0 6px}
h3{font-size:16px;margin:24px 0 4px}
p,li{font-size:15.5px;color:#2c2c2c}
li{margin:5px 0}
a{color:#000}
.meta{color:#00000099;font-size:13px}
.note{background:#faf4f2;border-radius:12px;padding:12px 14px}
table{width:100%;border-collapse:collapse;margin:14px 0 22px;font-size:14px;display:block;overflow-x:auto}
th,td{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid #00000014}
th{background:#faf4f2;font-size:12px}
table.summary{background:#faf4f2;border-radius:14px}
ul,ol{padding-left:20px}`;

for (const [file, title] of [["terms", "Terms & Conditions"], ["privacy", "Privacy Policy"]]) {
  const body = readFileSync(path.join(root, "content", "legal", `${file}.html`), "utf8")
    // In the offline copy the cross-links stay inside the page.
    .replaceAll('href="/privacy"', 'href="privacy.html"')
    .replaceAll('href="/terms"', 'href="terms.html"');
  writeFileSync(path.join(out, `${file}.html`), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · Paartha</title><style>${css}</style></head><body>\n${body}</body></html>\n`);
  console.log("wrote", path.join(out, `${file}.html`));
}
