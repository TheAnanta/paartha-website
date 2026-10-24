export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://paartha-api-1088270011688.asia-south1.run.app").replace(/\/+$/, "");

export interface Pack { id: string; mudras: number; price: number }
export interface Account {
  name: string;
  email: string;
  username: string | null;
  image: string;
  semester: number;
  joined_at: string;
  mudras: number;
  promotional_mudras: number;
  earned_mudras: number;
  courses: number;
  packs: Pack[];
  purchases: { id: string; mudras: number; amount: number; date: string }[];
}
export interface Order { purchase_id: string; amount: number; mudras: number; razorpay_order_id?: string; razorpay_key_id?: string }

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

async function call<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/web/mudras${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", "x-platform": "web" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json?.error?.code ?? "error", json?.error?.message ?? "Something went wrong. Try again.");
  return json as T;
}

export const getAccount = (token: string) => call<Account>(token, "GET", "/account");
export const createOrder = (token: string, packId: string) => call<Order>(token, "POST", "/orders", { pack_id: packId });
export const verifyOrder = (token: string, id: string, proof: { razorpay_payment_id: string; razorpay_signature: string } | {}) =>
  call<{ mudras: number; mudras_total: number }>(token, "POST", `/orders/${id}/verify`, proof);
