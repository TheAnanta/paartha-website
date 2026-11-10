"use client";

import { getMessaging, getToken } from "firebase/messaging";
import { API_BASE } from "./api";
import { firebaseApp, auth } from "./firebase";

/** Public Web Push (VAPID) key from Firebase console > Project settings > Cloud Messaging > Web Push certificates. */
export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

export const webPushConfigured = () => VAPID_KEY !== "";

/** Last failure message from enableWebPush (shown in the dialog to help debugging). */
export let lastWebPushError = "";

export type WebPushResult = "subscribed" | "denied" | "unsupported" | "unconfigured" | "error";

/**
 * Ask for notification permission (call this ONLY from a click handler), get the FCM web token and
 * send it to the backend.
 *
 * TODO(backend): these endpoints do not exist yet.
 *   POST {API_BASE}/web-push/subscribe   body { token, platform: "web" }   optional Bearer; anonymous visitors allowed
 *   PUT  {API_BASE}/me/web-push-token    body { token }                    Bearer required (signed-in students)
 * The web token must NOT be stored in Student.fcm_token (that is the app's token).
 */
let warm: Promise<ServiceWorkerRegistration> | null = null;

/** Register the service worker ahead of the click, so the click handler can go straight to the permission prompt and getToken. */
export function warmUpWebPush(): void {
  if (warm || typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  warm = navigator.serviceWorker.register("/firebase-messaging-sw.js").then(() => navigator.serviceWorker.ready);
  warm.catch(() => { warm = null; });
}

const withTimeout = <T,>(p: Promise<T>, ms: number, label: string) =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error(`timeout: ${label}`)), ms))]);

export async function enableWebPush(): Promise<WebPushResult> {
  lastWebPushError = "";
  if (!VAPID_KEY) return "unconfigured";
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) return "unsupported";
  warmUpWebPush();
  // Safari only honours the permission request (and push subscribe) right after the click: nothing is awaited before it.
  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permission !== "granted") return "denied";
  try {
    const registration = await withTimeout(warm!, 15000, "service worker not ready");
    const token = await withTimeout(getToken(getMessaging(firebaseApp), { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration }), 20000, "getToken (browser push service)");
    if (!token) return "error";
    const idToken = await auth.currentUser?.getIdToken().catch(() => undefined);
    const res = await withTimeout(fetch(`${API_BASE}/web-push/subscribe`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-platform": "web", ...(idToken ? { authorization: `Bearer ${idToken}` } : {}) },
      body: JSON.stringify({ token, platform: "web" }),
    }), 15000, "saving token on server");
    if (!res.ok) { lastWebPushError = `server answered ${res.status}`; return "error"; }
    return "subscribed";
  } catch (e) {
    console.error("[web push]", e);
    lastWebPushError = e instanceof Error ? e.message : String(e);
    return "error";
  }
}
