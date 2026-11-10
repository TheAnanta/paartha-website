"use client";

import { useEffect, useState } from "react";
import { enableWebPush, webPushConfigured, type WebPushResult } from "@/lib/webpush";

/** "Notify me" opt-in. Renders nothing until NEXT_PUBLIC_FIREBASE_VAPID_KEY is set. */
export default function NotifyButton({ className = "btn" }: { className?: string }) {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<WebPushResult | "idle" | "busy">("idle");
  useEffect(() => {
    setShow(webPushConfigured() && typeof Notification !== "undefined" && Notification.permission !== "denied");
  }, []);
  if (!show) return null;
  const label = state === "subscribed" ? "You're on the list" : state === "busy" ? "Turning on..." : state === "error" ? "Couldn't turn on. Try again" : "Notify me";
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
