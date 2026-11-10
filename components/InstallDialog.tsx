"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/** Step-by-step "Add to Home Screen" help for iPhone Safari. */
export default function InstallDialog({ onClose }: { onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>("button.pp-yes")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !box.current) return;
      const f = Array.from(box.current.querySelectorAll<HTMLElement>("button"));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; opener?.focus?.(); };
  }, [onClose]);

  // Rendered on <body> so the Notify card's white text styles do not leak into the dialog.
  return createPortal(
    <div className="pp-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pp-box" ref={box} role="dialog" aria-modal="true" aria-labelledby="id-title">
        <button type="button" className="pp-x" aria-label="Close" onClick={onClose}>×</button>
        <img className="pp-img" src="/home/kavya_steps.webp" alt="A student confused by a tangled diagram while Kavya points to a clear, simple one" width={768} height={521} />
        <div className="pp-text">
          <h2 id="id-title">Add Paartha to your Home Screen</h2>
          <p>iPhone only allows notifications for apps on the Home Screen. It takes about ten seconds:</p>
          <ol className="id-steps">
            <li>Close this, then tap the <b>Share</b> button in Safari&apos;s toolbar (the square with an arrow, at the bottom of the screen).</li>
            <li>Scroll down and tap <b>Add to Home Screen</b>, then <b>Add</b>.</li>
            <li>Open <b>Paartha</b> from your Home Screen and tap <b>Notify me</b>.</li>
          </ol>
          <div className="pp-row"><button type="button" className="pp-yes" onClick={onClose}>Got it</button></div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
