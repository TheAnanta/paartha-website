"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef, useState } from "react";
import { TESTIMONIALS, YEARS } from "@/content/testimonials";

const YEAR_LABEL = ["", "1st year", "2nd year", "3rd year", "Final year"];

/** Early-adopter quotes: filter by year of study, scroll sideways (arrows, swipe or trackpad). */
export default function Testimonials() {
  const [year, setYear] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const list = TESTIMONIALS.filter((t) => !year || t.year === year);
  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  return (
    <div>
      <div className="tpills" role="tablist" aria-label="Filter by year of study">
        {YEARS.map(({ y, label }) => (
          <button key={y} role="tab" aria-selected={year === y} className={`tpill${year === y ? " on" : ""}`} onClick={() => { setYear(y); ref.current?.scrollTo({ left: 0 }); }}>{label}</button>
        ))}
      </div>
      <div className="tscroll" ref={ref} tabIndex={0} aria-label="Student testimonials">
        {list.map((t, i) => (
          <figure className={`tcard t${i % 4}`} key={t.name + t.title}>
            <Quote size={28} strokeWidth={2.4} aria-hidden className="tq" />
            <h3>{t.title}</h3>
            <blockquote>{t.quote}</blockquote>
            <figcaption><b>{t.name}</b><span>{t.branch} · {YEAR_LABEL[t.year]}</span></figcaption>
          </figure>
        ))}
      </div>
      <div className="tnav">
        <button className="rbtn" aria-label="Previous testimonials" onClick={() => go(-1)}><ChevronLeft size={20} /></button>
        <button className="rbtn" aria-label="Next testimonials" onClick={() => go(1)}><ChevronRight size={20} /></button>
      </div>
    </div>
  );
}
