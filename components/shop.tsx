"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Course } from "@/lib/student";

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null);
/** What the app's sheet shows as the description: the first sentence, up to " of both". */
export const blurb = (c: Course) => `${c.description.split(" of both")[0].replace(/\.$/, "")}.`;
export const availability = (iso: string | null) => (iso ? `Course available from ${day(iso)}` : "Course available soon");

/** The census chip: a few student avatars and "455 students took this course". */
export function Members({ n }: { n?: number }) {
  if (!n) return null;
  return (
    <span className="chip">
      <span className="avs" aria-hidden>{["char_1_learn", "char_2_course", "char_6_profile"].map((a) => (<img key={a} src={`/home/${a}.webp`} alt="" width={22} height={22} />))}</span>
      {n.toLocaleString("en-IN")} students took this course
    </span>
  );
}

/** The course picture on a card (the app's course image, on its own colour). */
export function CourseImage({ c }: { c: Course }) {
  if (!c.image) return null;
  return <div className="cimg" style={{ background: c.image_color ?? "var(--nautilus)" }}><img src={c.image} alt="" loading="lazy" /></div>;
}

/** The small square picture next to a course in the cart: its thumbnail, else its image, else the course code. */
export function Thumb({ c }: { c: Course }) {
  const src = c.thumbnail || c.image;
  return (
    <div className="thumb" style={{ background: c.image_color ?? "var(--nautilus)" }}>
      {src ? <img src={src} alt="" loading="lazy" /> : <span>{c.code.slice(0, 4)}</span>}
    </div>
  );
}

/** Three lines of text with "Read more", like the app's description. */
export function Desc({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [long, setLong] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !open) setLong(el.scrollHeight > el.clientHeight + 1);
  }, [text, open]);
  return (
    <div>
      <p ref={ref} className={`muted small desc${open ? "" : " clamp"}`}>{text}</p>
      {(long || open) && <button className="acct-link small" style={{ margin: 0 }} onClick={() => setOpen(!open)}>{open ? "Show less" : "Read more"}</button>}
    </div>
  );
}
