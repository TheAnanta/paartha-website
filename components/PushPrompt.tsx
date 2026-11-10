"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { enableWebPush, warmUpWebPush, lastWebPushError, webPushConfigured } from "@/lib/webpush";

const KEY = "paartha-push-prompt";
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;
const DELAY_MS = 1000;

const snoozed = () => {
  try { const t = Number(localStorage.getItem(KEY)); return t > 0 && Date.now() - t < SNOOZE_MS; } catch { return false; }
};
const snooze = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch { /* storage unavailable */ } };

/** Friendly opt-in dialog for web push. The browser's permission prompt only appears after "Yes, I'm in". */
export default function PushPrompt() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"ask" | "busy" | "done" | "error" | "blocked">("ask");
  const [detail, setDetail] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!webPushConfigured() || typeof Notification === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
    warmUpWebPush();
    if (Notification.permission !== "default" || snoozed()) return;
    const t = setTimeout(() => { opener.current = document.activeElement; setOpen(true); }, DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const close = useCallback((remember: boolean) => {
    if (remember) snooze();
    setOpen(false);
    (opener.current as HTMLElement | null)?.focus?.();
  }, []);

  useEffect(() => {
    if (!open) return;
    box.current?.querySelector<HTMLElement>("button.pp-yes")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(true); return; }
      if (e.key !== "Tab" || !box.current) return;
      const f = Array.from(box.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);

  if (!open) return null;

  const yes = async () => {
    setState("busy");
    const r = await enableWebPush();
    if (r === "subscribed") { snooze(); setState("done"); setTimeout(() => setOpen(false), 2200); }
    else if (r === "denied") { snooze(); setState("blocked"); }
    else { setDetail(r === "unsupported" ? "This browser does not support push notifications." : lastWebPushError); setState("error"); }
  };

  return (
    <div className="pp-back" onMouseDown={(e) => { if (e.target === e.currentTarget) close(true); }}>
      <div className="pp-box" ref={box} role="dialog" aria-modal="true" aria-labelledby="pp-title" aria-describedby="pp-body">
        <button type="button" className="pp-x" aria-label="Close" onClick={() => close(true)}>×</button>
        <img className="pp-img" src="/home/kavya_paartha.webp" alt="Kavya, a Paartha student character, frowning at her syllabus before an exam" width={800} height={528} />
        <div className="pp-text">
          {state === "done" ? (
            <>
              <h2 id="pp-title">You&apos;re in. Thank you!</h2>
              <p id="pp-body">We&apos;ll send you the good stuff, only when it matters.</p>
            </>
          ) : state === "blocked" ? (
            <>
              <h2 id="pp-title">Notifications are blocked</h2>
              <p id="pp-body">No problem. If you change your mind, allow notifications for this site in your browser settings.</p>
              <div className="pp-row"><button type="button" className="pp-no" onClick={() => close(false)}>Close</button></div>
            </>
          ) : (
            <>
              <h2 id="pp-title">Stay updated on the latest exam preparation tips and updates</h2>
              <p id="pp-body">
                We&apos;d love to send you notifications: exam prep tips, new subject content and exam-week reminders. It&apos;s occasional, never spammy, and you can turn it off any time in your browser settings.
              </p>
              {state === "error" && <p className="pp-err" role="alert">Couldn&apos;t turn notifications on. Please try again.{detail && <small className="pp-detail">{detail}</small>}</p>}
              <div className="pp-row">
                <button type="button" className="pp-yes" onClick={yes} disabled={state === "busy"}>{state === "busy" ? "Turning on..." : "Yes, I'm in"}</button>
                <button type="button" className="pp-no" onClick={() => close(true)} disabled={state === "busy"}>Not interested</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
