/*
 * Builds the Paartha note sheets as one A4 PDF, from the two Figma designs ("A4 - Design", odd and even pages).
 *
 *  - The frame (border, watermark) is painted on a canvas at 300 dpi with the exact Figma geometry, once for odd
 *    pages and once for even pages. It is embedded once per kind, so a 200-page PDF stays small.
 *  - The wordmark, the subject line and the copyright note are real text in the PDF (Funnel Sans, Ambit), not pictures.
 *  - All numbers below are Figma pixels. The frames are 595 x 842, which is A4 in points (1 px = 1 pt).
 *
 * What differs between the odd and the even page (checked in Figma): only the watermark. It is one wide picture
 * (2456 x 1728) laid over a 570 x 809 box at 2% opacity; the box shows the LEFT half of the picture on odd pages
 * (picture offset 0) and the RIGHT half on even pages (picture offset -93.55% of the box width = -533.2).
 */
(function () {
  const FRAME_W = 595, FRAME_H = 842;                 // the Figma frame
  const PAGE_W = 595.276, PAGE_H = 841.89;            // A4 in points
  const DPI_W = 2480, DPI_H = 3508;                   // A4 at 300 dpi
  const SX = DPI_W / FRAME_W, SY = DPI_H / FRAME_H;

  // The text rules the brief asks for, measured from the page edges.
  const SUBJECT_RIGHT = 40, SUBJECT_TOP = 39, SUBJECT_SIZE = 10;
  // Figma sets its text a little differently from a browser's line-height rules; these nudges (Figma px) were measured against the
  // Figma screenshots of both pages, so the rendered result matches them to within 0.3 pt.
  const SUBJECT_NUDGE = -1.9, WORDMARK_NUDGE = 1.1;

  // Font line metrics (units per em): Funnel Sans (hhea = typo), Ambit (typo, as Chrome and Figma use USE_TYPO_METRICS).
  const FUNNEL = { asc: 1.2, desc: 0.3, gap: 0, upm: 1200 };
  const AMBIT = { asc: 0.75, desc: 0.25, gap: 0.15, upm: 1000 };

  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const loadImage = (b) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("image failed")); i.src = "data:image/png;base64," + b; });

  let cache;
  async function frames() {
    if (cache) return cache;
    const [strip, wm] = await Promise.all([loadImage(ASSETS.border), loadImage(ASSETS.watermark)]);
    const make = (even) => {
      const c = document.createElement("canvas"); c.width = DPI_W; c.height = DPI_H;
      const g = c.getContext("2d"); g.scale(SX, SY); g.imageSmoothingQuality = "high";
      g.fillStyle = "#fff"; g.fillRect(0, 0, FRAME_W, FRAME_H);
      // A border strip: 614 x 17 box, the 1536 x 56 picture inside it at 100.07% x 131.76%, shifted up 2.35%.
      const flat = (x, y) => { g.save(); g.beginPath(); g.rect(x, y, 614, 17); g.clip(); g.drawImage(strip, x, y - 0.4, 614.4, 22.4); g.restore(); };
      const upright = (x, y) => { // a strip turned 90 degrees clockwise inside a 17 x 614 box at (x, y)
        g.save(); g.translate(x + 8.5, y + 307); g.rotate(Math.PI / 2); g.beginPath(); g.rect(-307, -8.5, 614, 17); g.clip();
        g.drawImage(strip, -307, -8.5 - 0.4, 614.4, 22.4); g.restore();
      };
      flat(-284.5, 8); flat(285.5, 8);                    // top
      upright(8, -67); upright(8, 503);                   // left
      flat(-284.5, 817); flat(285.5, 817);                // bottom
      upright(570, -67); upright(570, 503);               // right
      // The watermark: box (0, 16, 570, 809), picture 201.88% x 100.11% of the box, at 2% opacity.
      g.save(); g.beginPath(); g.rect(0, 16, 570, 809); g.clip(); g.globalAlpha = 0.03;
      g.drawImage(wm, even ? -0.9355 * 570 : 0, 16 - 0.0006 * 809, 2.0188 * 570, 1.0011 * 809); g.restore();
      return c;
    };
    cache = { odd: make(false), even: make(true) };
    return cache;
  }

  const toPng = (canvas) => new Promise((res) => canvas.toBlob((b) => b.arrayBuffer().then((a) => res(new Uint8Array(a))), "image/png"));

  async function make({ subject, pagesPerUnit, parity, firstUnit = 1, startPages = [], blankPad = true }) {
    const { PDFDocument, rgb, degrees } = PDFLib;
    const warnings = [];
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);
    doc.setTitle(`Paartha notes: ${subject}`); doc.setCreator("Paartha note sheets");
    const [bold, regular, light, ambit] = await Promise.all([
      doc.embedFont(b64(ASSETS.funnelBold), { subset: false }), doc.embedFont(b64(ASSETS.funnelRegular), { subset: false }),
      doc.embedFont(b64(ASSETS.funnelLight), { subset: false }), doc.embedFont(b64(ASSETS.ambitBold), { subset: false }),
    ]);
    const ambitFk = fontkit.create(b64(ASSETS.ambitBold));
    const f = await frames();
    const img = { odd: await doc.embedPng(await toPng(f.odd)), even: await doc.embedPng(await toPng(f.even)) };
    const kx = PAGE_W / FRAME_W, ky = PAGE_H / FRAME_H;   // Figma px -> points on the A4 page
    const top = (y) => PAGE_H - y;                         // distance from the top edge -> PDF y

    // Static text, laid out once.
    const wordSize = 17.741, tracking = 0.1774, lineH = 19.008;
    const run = ambitFk.layout("PAARTHA.");
    let gx = 38 * kx; const glyphs = [];
    run.glyphs.forEach((gl, i) => { glyphs.push({ ch: "PAARTHA."[i], x: gx }); gx += run.positions[i].xAdvance * wordSize / ambitFk.unitsPerEm * kx + tracking * kx; });
    const wordBase = (47.5 - lineH / 2) + ((lineH - (AMBIT.asc + AMBIT.desc) * wordSize) / 2 + AMBIT.asc * wordSize) + WORDMARK_NUDGE;   // from the top, Figma px
    const copy = "© 2026 the ananta. All Rights Reserved", copySize = 5;
    const copyW = light.widthOfTextAtSize(copy, copySize), copyLh = (FUNNEL.asc + FUNNEL.desc + FUNNEL.gap) * copySize;
    const copyBaseX = (591 - copyLh / 2 + FUNNEL.asc * copySize) * kx, copyY = top((771 + copyW / 2) * ky);

    let total = 0, blanks = 0, doc_i = 0;
    for (let i = 0; i < pagesPerUnit.length; i++) {
      const u = firstUnit + i;   // the unit number printed on the page
      const n = pagesPerUnit[i];
      const startPage = startPages[i] || 1;   // the first page number printed in this unit (1 when none is given)
      for (let p = startPage; p < startPage + n; p++) {   // the page number printed on the page
        doc_i++; total++;
        const odd = (parity === "doc" ? doc_i : p) % 2 === 1;
        const page = doc.addPage([PAGE_W, PAGE_H]);
        page.drawImage(odd ? img.odd : img.even, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
        glyphs.forEach((g) => page.drawText(g.ch, { x: g.x, y: top(wordBase * ky), size: wordSize, font: ambit, color: rgb(0x2c / 255, 0x2c / 255, 0x2c / 255) }));
        page.drawText(copy, { x: copyBaseX, y: copyY, size: copySize, font: light, color: rgb(0, 0, 0), rotate: degrees(90) });
        // "Subject / Unit u / p": bold, then the page number in regular; ends exactly 40 from the right edge, starts 39 from the top.
        const lead = `${subject} / Unit ${u} / `, num = String(p);
        const wLead = bold.widthOfTextAtSize(lead, SUBJECT_SIZE), wNum = regular.widthOfTextAtSize(num, SUBJECT_SIZE);
        const x0 = PAGE_W - SUBJECT_RIGHT - (wLead + wNum);
        if (x0 < 150 && !warnings.length) warnings.push("The subject name is long: its line now runs into the PAARTHA. mark on some pages.");
        const base = top(SUBJECT_TOP + FUNNEL.asc * SUBJECT_SIZE + SUBJECT_NUDGE);
        page.drawText(lead, { x: x0, y: base, size: SUBJECT_SIZE, font: bold, color: rgb(0, 0, 0) });
        page.drawText(num, { x: x0 + wLead, y: base, size: SUBJECT_SIZE, font: regular, color: rgb(0, 0, 0) });
      }
      // An odd number of pages: a plain white page after the unit, so every unit prints as whole sheets (double-sided).
      if (blankPad && n % 2 === 1) { doc_i++; blanks++; doc.addPage([PAGE_W, PAGE_H]); }
    }
    return { bytes: await doc.save(), total: total + blanks, blanks, warnings };
  }

  window.NoteSheets = { frames, make };
})();
