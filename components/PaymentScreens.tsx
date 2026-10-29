"use client";

import { ChevronUp, Headset, RefreshCw } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import type { Course } from "@/lib/student";

const SUPPORT_HREF = "/support";

/** The same screens as the app's payment flow (payment_screens.dart), with the same copy. */
function Bar({ right }: { right?: ReactNode }) {
  return (
    <div className="pbar">
      <span className="brand">PAARTHA</span>
      {right ?? <Link href={SUPPORT_HREF} className="psupport"><Headset size={22} /><span>Support</span></Link>}
    </div>
  );
}

/** PAYMENT IN PROGRESS: the app's loading screen. `onVerify` is the "verify payment" button. */
export function PaymentLoading({ paymentId, onVerify }: { paymentId: string; onVerify?: () => void }) {
  return (
    <div className="pscreen">
      <Bar />
      <div className="pmedia"><video src="/pay/processing.mp4" autoPlay muted loop playsInline aria-hidden /></div>
      <div className="pcopy">
        <h1>PAYMENT IN PROGRESS</h1>
        {paymentId && <p className="pid">Payment ID: {paymentId.toUpperCase()}</p>}
        {onVerify && <button className="pghost" onClick={onVerify}>verify payment</button>}
      </div>
      <p className="pnote">Please don’t close or go back, you should have access to the <b>best exam preparation experience within 5-10 mins.</b></p>
    </div>
  );
}

/** OOPS! Something went wrong: the app's failure screen, entering the same way (bar from the top, text from the bottom). */
export function PaymentFailure({ code, paymentId, onRetry, retryHref }: { code: string; paymentId: string; onRetry?: () => void; retryHref?: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 30); return () => clearTimeout(t); }, []);
  return (
    <div className={`pscreen enter${shown ? " in" : ""}`}>
      <Bar />
      <div className="pmedia"><video src="/pay/failed.mp4" autoPlay muted loop playsInline aria-hidden /></div>
      <div className="pcopy">
        <h1 className="small">OOPS! Something went wrong</h1>
        <p className="pmsg">Try again, or get a glass of water, make your setup ready and retry the payment and we’ll get it sorted by then.</p>
        <p className="pcode">Error Code: {code}</p>
        {paymentId && <p className="pcode">Payment ID: {paymentId.toUpperCase()}</p>}
        {retryHref
          ? <Link className="pdark" href={retryHref}><RefreshCw size={16} /> retry payment</Link>
          : <button className="pdark" onClick={onRetry}><RefreshCw size={16} /> retry payment</button>}
      </div>
    </div>
  );
}

/**
 * HURRAY!: the celebration video fills the screen with the title (the video starts on white and turns purple about 2 seconds
 * in, so the white title fades in then); after ~5 seconds, or on a tap or a scroll, it shrinks to a hero and the receipt is shown.
 */
export function PaymentSuccess({ paymentId, courses = [], startHref = "/#download" }: { paymentId: string; courses?: Course[]; startHref?: string }) {
  const [purple, setPurple] = useState(false);
  const [full, setFull] = useState(true);
  useEffect(() => {
    const a = setTimeout(() => setPurple(true), 1900);
    const b = setTimeout(() => setFull(false), 4800);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  // The celebration plays once, then its last stretch (from 4.04 s) loops.
  const onEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => { e.currentTarget.currentTime = 4.04; void e.currentTarget.play(); };
  return (
    <div className="psuccess">
      <div className={`phero${full ? " full" : ""}`} onClick={() => setFull(false)} onWheel={(e) => { if (e.deltaY > 0) setFull(false); }}>
        <video src="/pay/success.mp4" poster="/pay/success.webp" autoPlay muted playsInline onEnded={onEnded} aria-hidden />
        <div className={`pfade${purple ? " on" : ""}`} />
        <div className={`ptitle${purple ? " on" : ""}`}>
          <div className="pbar light"><span className="brand">PAARTHA</span></div>
          <div className="pspacer" />
          <h1>HURRAY!</h1>
          <p>You just got yourself access to the best exam preparation experience</p>
          <div className={`phint${full ? " on" : ""}`}><ChevronUp size={22} /></div>
        </div>
      </div>
      <div className="preceipt">
        <p className="pid dark">Payment ID: {paymentId.toUpperCase()}</p>
        {courses.length > 0 && (
          <>
            <p className="pstrong">You now have access to:</p>
            <ul>{courses.map((c) => (<li key={c.id}><b>{c.title}</b><span>{c.code}</span></li>))}</ul>
          </>
        )}
        <Link className="pdark wide" href={startHref}>Start Learning</Link>
      </div>
    </div>
  );
}
