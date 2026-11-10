"use client";

import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { API_BASE } from "./api";
import { firebaseApp, auth } from "./firebase";

/** Public Web Push (VAPID) key from Firebase console > Project settings > Cloud Messaging > Web Push certificates. */
export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

export const webPushConfigured = () => VAPID_KEY !== "";

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
export async function enableWebPush(): Promise<WebPushResult> {
  if (!VAPID_KEY) return "unconfigured";
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator) || !(await isSupported())) return "unsupported";
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return "denied";
  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const token = await getToken(getMessaging(firebaseApp), { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
    if (!token) return "error";
    const idToken = await auth.currentUser?.getIdToken().catch(() => undefined);
    const res = await fetch(`${API_BASE}/web-push/subscribe`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-platform": "web", ...(idToken ? { authorization: `Bearer ${idToken}` } : {}) },
      body: JSON.stringify({ token, platform: "web" }),
    });
    return res.ok ? "subscribed" : "error";
  } catch {
    return "error";
  }
}
