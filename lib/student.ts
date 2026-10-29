// The student API the Flutter app uses (sign-in, courses, cart, payments), called from the website.
import { API_BASE, ApiError } from "@/lib/api";

export interface Course {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  image: string;
  image_color: string | null;
  thumbnail: string | null;
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
export interface PaymentRecord { id: string; status: "successful" | "pending" | "failed"; courses: Course[]; subtotal: number; tax: number }
export interface Checkout { payment_id: string; status: "successful" | "pending" | "failed"; amount: number; razorpay_order_id: string | null; razorpay_key_id: string | null }
export type Session = { outcome: "signed_in" | "needs_sign_up" | "device_exists" | "device_exhausted"; roll_number?: string };

/** The same text the app's pre-registration sheet shows. Product copy, as in the backend's PLAN. */
export const PLAN = {
  name: "Gandiva",
  tag: "Sessional 2",
  features: ["content unlocked for unit 3-5", "access to handwritten notes", "access to fast prep cheatsheets", "access to important and PYQs"],
};

/** Marks a request as coming from the website: the API skips the device check and never binds a device for it. */
const WEB_ID = "paartha-website";

async function call<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", "x-platform": "web", "x-web-id": WEB_ID },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json?.error?.code ?? "error", json?.error?.message ?? "Something went wrong. Try again.");
  return json as T;
}

export const startSession = (token: string, photoUrl?: string | null) =>
  call<Session>(token, "POST", "/auth/session", { ...(photoUrl?.startsWith("https://") ? { photo_url: photoUrl } : {}) });
export const signUp = (token: string, b: { name: string; roll_number: string; invited_by?: string; photo_url?: string | null }) =>
  call<unknown>(token, "POST", "/auth/sign-up", { name: b.name, roll_number: b.roll_number, invited_by: b.invited_by || undefined, ...(b.photo_url?.startsWith("https://") ? { photo_url: b.photo_url } : {}) });
export const listCourses = (token: string) => call<Course[]>(token, "GET", "/courses");
export const getCart = (token: string) => call<Cart>(token, "GET", "/cart");
export const addToCart = (token: string, id: string) => call<Cart>(token, "PUT", `/cart/items/${encodeURIComponent(id)}`);
export const startPayment = (token: string) => call<PaymentStart>(token, "POST", "/payments");
export const verifyPayment = (token: string, id: string, proof: { razorpay_payment_id: string; razorpay_signature: string } | {}) =>
  call<PaymentRecord>(token, "POST", `/payments/${id}/verify`, proof);
export const removeFromCart = (token: string, id: string) => call<Cart>(token, "DELETE", `/cart/items/${encodeURIComponent(id)}`);
/** course id -> how many students are shown as taking it. */
export const getCensus = (token: string) => call<Record<string, number>>(token, "GET", "/courses/census");
/** The Razorpay order for an existing payment (the desktop app opens /pay/<payment id>). */
export const getCheckout = (token: string, id: string) => call<Checkout>(token, "GET", `/payments/${encodeURIComponent(id)}/checkout`);
