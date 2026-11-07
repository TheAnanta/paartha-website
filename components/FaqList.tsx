"use client";

import { useState } from "react";

/** The questions: the open one turns red and its answer slides out from under it (and back in when it closes). */
export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faqlist">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div className={`faqitem${on ? " on" : ""}`} key={it.q}>
            <button type="button" className="faqq" aria-expanded={on} aria-controls={`faq-a-${i}`} onClick={() => setOpen(on ? null : i)}>{it.q}<span aria-hidden /></button>
            <div className="faqwrap" id={`faq-a-${i}`} role="region">
              <div className="faqclip"><p>{it.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
