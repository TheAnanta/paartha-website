"use client";

import { useEffect, useState } from "react";
import InstallDialog from "./InstallDialog";
import { enableWebPush, warmUpWebPush, webPushConfigured, type WebPushResult } from "@/lib/webpush";

type Mode = "none" | "notify" | "install";

/** iPhone/iPad Safari tab: push only works once the site is on the Home Screen. */
function needsInstall(): boolean {
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = (navigator as Navigator & { standalone?: boolean }).standalone === true || window.matchMedia("(display-mode: standalone)").matches;
  return ios && !standalone && !("PushManager" in window);
}

/** "Notify me" opt-in; on iPhone Safari it becomes "Add to Home Screen". Renders nothing until NEXT_PUBLIC_FIREBASE_VAPID_KEY is set. */
export default function NotifyButton({ className = "btn" }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("none");
  const [state, setState] = useState<WebPushResult | "idle" | "busy">("idle");
  const [steps, setSteps] = useState(false);
  useEffect(() => {
    if (!webPushConfigured()) return;
    if (needsInstall()) { setMode("install"); return; }
    if (typeof Notification !== "undefined" && "PushManager" in window && Notification.permission !== "denied") {
      if (Notification.permission === "granted") setState("subscribed");
      warmUpWebPush();
      setMode("notify");
    }
  }, []);
  if (mode === "none") return null;

  if (mode === "install") {
    return (
      <>
        <button type="button" className={className} aria-haspopup="dialog" onClick={() => setSteps(true)}>Add to Home Screen</button>
        <p className="installnote">To get notifications on iPhone, add Paartha to your Home Screen first.</p>
        {steps && <InstallDialog onClose={() => setSteps(false)} />}
      </>
    );
  }

  const label = state === "subscribed" ? "You're notified" : state === "busy" ? "Turning on..." : state === "error" ? "Couldn't turn on. Try again" : "Notify me";
  return (
    <button
      type="button"
      className={className}
      disabled={state === "busy" || state === "subscribed"}
      onClick={async () => { setState("busy"); setState(await enableWebPush()); }}
    >
      {label}
    </button>
  );
}
