"use client";

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open(): void; on(event: string, cb: (r: { error?: { description?: string } }) => void): void } }
}

let loading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => { loading = null; reject(new Error("Couldn't load the payment window. Check your connection and try again.")); };
    document.head.appendChild(s);
  });
  return loading;
}

export type CheckoutResult =
  | { status: "paid"; paymentId: string; signature: string }
  | { status: "closed" }
  | { status: "failed"; message: string };

/** Opens Razorpay Checkout for an order and reports how it ended. */
export async function openCheckout(opts: { keyId: string; orderId: string; amountRupees: number; description: string; email?: string; name?: string }): Promise<CheckoutResult> {
  await loadScript();
  return new Promise((resolve) => {
    let done = false;
    const finish = (r: CheckoutResult) => { if (!done) { done = true; resolve(r); } };
    const rz = new window.Razorpay!({
      key: opts.keyId,
      order_id: opts.orderId,
      amount: opts.amountRupees * 100,
      currency: "INR",
      name: "Paartha",
      description: opts.description,
      prefill: { email: opts.email, name: opts.name },
      theme: { color: "#263A61" },
      handler: (r: { razorpay_payment_id: string; razorpay_signature: string }) => finish({ status: "paid", paymentId: r.razorpay_payment_id, signature: r.razorpay_signature }),
      modal: { ondismiss: () => finish({ status: "closed" }) },
    });
    rz.on("payment.failed", (r) => finish({ status: "failed", message: r.error?.description ?? "The payment didn't go through." }));
    rz.open();
  });
}
