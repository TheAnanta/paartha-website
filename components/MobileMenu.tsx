"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  ["/educators", "Educators"],
  ["/sarathi", "Team"],
  ["/support", "Support"],
  ["/terms", "Terms"],
  ["/privacy", "Privacy"],
  ["/account", "Account"],
] as const;

/** Phone header: the primary call to action stays visible, every other link moves into a hamburger menu. */
export default function MobileMenu({ cta }: { cta: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className="navmob">
      {cta && <Link href="/courses" className="navcta" onClick={() => setOpen(false)}>Get courses</Link>}
      <button type="button" className="burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobmenu" onClick={() => setOpen((o) => !o)}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
          {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <>
          <div className="mobback" onClick={() => setOpen(false)} />
          <ul id="mobmenu" className="mobmenu">
            {LINKS.map(([href, label]) => (
              <li key={href}><Link href={href} onClick={() => setOpen(false)}>{label}</Link></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
