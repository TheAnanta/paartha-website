// The student API the Flutter app uses (sign-in, courses, cart, payments), called from the website.
import { API_BASE, ApiError } from "@/lib/api";

export interface Course {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  price: number;
  regular_price: number;
  purchased: boolean;
  enrolled: boolean;
  pre_registration: boolean;
  available_from: string | null;
}
export interface Cart {
  items: Course[];
  subtotal: number;
  coupon: { code: string; percent: number; discount: number } | null;
  mudras_available: number;
  mudras_applied: number;
  mudra_discount: number;
  total: number;
}
export interface PaymentStart { payment_id: string; amount: number; razorpay_order_id?: string; razorpay_key_id?: string }
export type Session = { outcome: "signed_in" | "needs_sign_up" | "device_exists" | "device_exhausted"; roll_number?: string };

/** The same text the app's pre-registration sheet shows. Product copy, as in the backend's PLAN. */
export const PLAN = {
  name: "Gandiva",
  tag: "Sessional 2",
  features: ["content unlocked for unit 3-5", "access to handwritten notes", "access to fast prep cheatsheets", "access to important and PYQs"],
};

/** This browser's stand-in for a phone's device id; the account binds to it the way it binds to a phone. */
export function deviceId(): string {
  try {
    let id = localStorage.getItem("paartha-web-device");
    if (!id) { id = `web-${crypto.randomUUID()}`; localStorage.setItem("paartha-web-device", id); }
    return id;
  } catch {
    return "web-session";
  }
}

async function call<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", "x-platform": "web", "x-device-id": deviceId() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json?.error?.code ?? "error", json?.error?.message ?? "Something went wrong. Try again.");
  return json as T;
}

export const startSession = (token: string, photoUrl?: string | null) =>
  call<Session>(token, "POST", "/auth/session", { device_id: deviceId(), ...(photoUrl?.startsWith("https://") ? { photo_url: photoUrl } : {}) });
export const signUp = (token: string, b: { name: string; roll_number: string; invited_by?: string; photo_url?: string | null }) =>
  call<unknown>(token, "POST", "/auth/sign-up", { name: b.name, roll_number: b.roll_number, invited_by: b.invited_by || undefined, device_id: deviceId(), ...(b.photo_url?.startsWith("https://") ? { photo_url: b.photo_url } : {}) });
export const listCourses = (token: string) => call<Course[]>(token, "GET", "/courses");
export const getCart = (token: string) => call<Cart>(token, "GET", "/cart");
export const addToCart = (token: string, id: string) => call<Cart>(token, "PUT", `/cart/items/${encodeURIComponent(id)}`);
export const startPayment = (token: string) => call<PaymentStart>(token, "POST", "/payments");
export const verifyPayment = (token: string, id: string, proof: { razorpay_payment_id: string; razorpay_signature: string } | {}) =>
  call<{ id: string; courses: Course[]; subtotal: number; tax: number }>(token, "POST", `/payments/${id}/verify`, proof);
