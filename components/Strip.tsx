"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/** The app screenshots: they scroll along by themselves (pausing while you touch or hover) and have arrows. */
export default function Strip({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const step = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const w = (el.querySelector("img")?.clientWidth ?? 240) + 16;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir === 1 && end) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && el.scrollLeft <= 8) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * w, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => step(1), 3200);
    return () => clearInterval(t);
  }, [paused, step]);

  return (
    <div className="stripwrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="strip" ref={ref} tabIndex={0} aria-label="App screenshots">
        {images.map((src, i) => (<img key={src} src={src} alt={`Paartha app screenshot ${i + 1} of ${images.length}`} width={600} height={1304} loading="lazy" />))}
      </div>
      <button className="arrow l" aria-label="Previous screenshot" onClick={() => step(-1)}><ChevronLeft size={22} /></button>
      <button className="arrow r" aria-label="Next screenshot" onClick={() => step(1)}><ChevronRight size={22} /></button>
    </div>
  );
}
