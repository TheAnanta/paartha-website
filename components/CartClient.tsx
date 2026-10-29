"use client";

import { signOut, type User } from "firebase/auth";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import StudentGate from "@/components/StudentGate";
import { availability, day, inr, Members, Thumb } from "@/components/shop";
import { auth } from "@/lib/firebase";
import { openCheckout } from "@/lib/razorpay";
import { PaymentFailure, PaymentLoading, PaymentSuccess } from "@/components/PaymentScreens";
import { addToCart, type Cart, type Course, getCart, getCensus, listCourses, removeFromCart, startPayment, verifyPayment } from "@/lib/student";

export default function CartClient() {
  return <StudentGate>{(user) => <CartPage user={user} />}</StudentGate>;
}

function CartPage({ user }: { user: User }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [census, setCensus] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  // The checkout flow, as in the app: a processing screen, then the success celebration or the failure screen.
  type Flow = { kind: "processing"; paymentId: string } | { kind: "failed"; code: string; paymentId: string } | { kind: "success"; paymentId: string; courses: Course[] };
  const [flow, setFlow] = useState<Flow | null>(null);
  const paymentRef = useRef({ id: "", razorpayPaymentId: "", signature: "", courses: [] as Course[] });
  // The mobile "Pay now" bar scrolls to the summary and hides while the summary is on screen.
  const summaryRef = useRef<HTMLElement>(null);
  const [summaryShown, setSummaryShown] = useState(false);
  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSummaryShown(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  });

  const load = useCallback(async () => {
    const token = await user.getIdToken();
    const [ct, cs, cn] = await Promise.all([getCart(token), listCourses(token), getCensus(token).catch(() => ({}))]);
    setCart(ct);
    setCourses(cs);
    setCensus(cn);
  }, [user]);
  useEffect(() => { load().catch((e) => setError(e instanceof Error ? e.message : "We couldn't load your cart.")); }, [load]);

  async function act(key: string, fn: (token: string) => Promise<Cart>) {
    setError("");
    setBusy(key);
    try { setCart(await fn(await user.getIdToken())); } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); } finally { setBusy(null); }
  }
  const addAll = (ids: string[]) => act(ids.join(","), async (t) => { let c!: Cart; for (const id of ids) c = await addToCart(t, id); return c; });

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  /** Asks the server about the payment (again, while it is still pending) until it is confirmed or fails. */
  async function verify() {
    const pr = paymentRef.current;
    setFlow({ kind: "processing", paymentId: pr.id });
    try {
      const token = await user.getIdToken();
      for (let polled = 0; ; polled++) {
        const rec = await verifyPayment(token, pr.id, pr.razorpayPaymentId ? { razorpay_payment_id: pr.razorpayPaymentId, razorpay_signature: pr.signature } : {});
        if (rec.status === "successful") { setFlow({ kind: "success", paymentId: pr.id, courses: pr.courses }); await load().catch(() => undefined); return; }
        if (rec.status !== "pending") { setFlow({ kind: "failed", code: `payment_${rec.status}`, paymentId: pr.id }); return; }
        if (polled >= 5) { setFlow({ kind: "failed", code: "payment_pending", paymentId: pr.id }); return; }
        await wait(3000);
      }
    } catch (e) {
      setFlow({ kind: "failed", code: e instanceof Error ? e.message : "payment_failed", paymentId: pr.id });
    }
  }

  async function pay() {
    if (!cart || cart.items.length === 0) return;
    setError("");
    paymentRef.current = { id: "", razorpayPaymentId: "", signature: "", courses: cart.items };
    setFlow({ kind: "processing", paymentId: "" });
    try {
      const token = await user.getIdToken();
      const p = await startPayment(token);
      paymentRef.current.id = p.payment_id;
      if (p.amount > 0 && p.razorpay_order_id && p.razorpay_key_id) {
        const r = await openCheckout({ keyId: p.razorpay_key_id, orderId: p.razorpay_order_id, amountRupees: p.amount, description: `Pre-registration: ${cart.items.length} course${cart.items.length > 1 ? "s" : ""}`, email: user.email ?? undefined, name: user.displayName ?? undefined });
        if (r.status === "closed") { setFlow(null); return; } // closed the payment window: back to the cart
        if (r.status === "failed") { setFlow({ kind: "failed", code: "payment_failed", paymentId: p.payment_id }); return; }
        paymentRef.current.razorpayPaymentId = r.paymentId;
        paymentRef.current.signature = r.signature;
      }
      await verify(); // mudras covered everything: the server has already completed it, and a test server just needs the call
    } catch (e) {
      setFlow(null);
      setError(e instanceof Error ? e.message : "We couldn't start the payment.");
    }
  }

  // "retry payment": if the gateway took the money and only our check failed, the same payment is checked again, so no one is charged twice.
  const retry = () => (paymentRef.current.razorpayPaymentId || !paymentRef.current.id ? (paymentRef.current.id ? verify() : pay()) : pay());

  if (flow?.kind === "processing") return <PaymentLoading paymentId={flow.paymentId} onVerify={flow.paymentId ? verify : undefined} />;
  if (flow?.kind === "failed") return <PaymentFailure code={flow.code} paymentId={flow.paymentId} onRetry={retry} />;
  if (flow?.kind === "success") return <PaymentSuccess paymentId={flow.paymentId} courses={flow.courses} />;

  const inCart = new Set(cart?.items.map((i) => i.id));
  const more = courses.filter((c) => !c.purchased && !inCart.has(c.id));
  const moreTotal = more.reduce((s, c) => s + c.price, 0);
  const moreRegular = more.reduce((s, c) => s + c.regular_price, 0);
  const savings = (cart?.items ?? []).reduce((s, c) => s + Math.max(0, c.regular_price - c.price), 0);

  const AddAll = () => (
    <button className="addall" disabled={busy !== null} onClick={() => addAll(more.map((c) => c.id))}>
      {busy === more.map((c) => c.id).join(",") ? "Adding…" : `Add all ${more.length} for ${inr(moreTotal)}`}
    </button>
  );

  return (
    <div className="cartpage">
      <div className="acct-hero" style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 40, letterSpacing: -1, margin: 0 }}>Your cart</h1>
        <Link className="acct-link" href="/courses">All courses</Link>
        <button className="acct-link" style={{ marginLeft: 12 }} onClick={() => signOut(auth)}>Sign out</button>
      </div>
      {error && <p className="acct-msg bad">{error}</p>}
      {!cart ? <p className="muted">Loading…</p> : (
        <div className="shop">
          <div>
            {cart.items.length === 0 && <p className="muted">Your cart is empty. Add a course below, or <Link href="/courses">browse your courses</Link>.</p>}
            {cart.items.map((c) => (
              <article className="ccard line" key={c.id}>
                <Thumb c={c} />
                <div className="lmain">
                  <div className="ctop"><span className="tag">{c.code}</span><span className="tag out">Pre-registration</span></div>
                  <h3>{c.title}</h3>
                  <Members n={census[c.id]} />
                  <p className="avail">{availability(c.available_from)}</p>
                </div>
                <div className="lend">
                  <div className="price"><b>{inr(c.price)}</b>{c.regular_price > c.price && <s>{inr(c.regular_price)}</s>}</div>
                  <button className="acct-link" disabled={busy !== null} onClick={() => act(`rm${c.id}`, (t) => removeFromCart(t, c.id))}>{busy === `rm${c.id}` ? "Removing…" : "Remove"}</button>
                </div>
              </article>
            ))}

            {more.length > 0 && (
              <section>
                <div className="morehead">
                  <h2 className="section" style={{ margin: 0 }}>Add more courses</h2>
                  {more.length > 1 && <AddAll />}
                </div>
                <p className="muted small">Your other courses, at the pre-registration price. Add them now, before the price goes up.</p>
                {more.map((c) => (
                  <article className="ccard line more" key={c.id}>
                    <Thumb c={c} />
                    <div className="lmain">
                      <div className="ctop"><span className="tag">{c.code}</span></div>
                      <h3>{c.title}</h3>
                      <Members n={census[c.id]} />
                    </div>
                    <div className="lend">
                      <div className="price"><b>{inr(c.price)}</b>{c.regular_price > c.price && <s>{inr(c.regular_price)}</s>}</div>
                      <button className="pill ghost" disabled={busy !== null} onClick={() => addAll([c.id])}>{busy === c.id ? "Adding…" : "Add"}</button>
                    </div>
                  </article>
                ))}
                {more.length > 1 && (
                  <button className="acct-btn dark" disabled={busy !== null} onClick={() => addAll(more.map((c) => c.id))}>
                    {busy === more.map((c) => c.id).join(",") ? "Adding…" : `Add all ${more.length} for ${inr(moreTotal)}`}
                  </button>
                )}
                {moreRegular > moreTotal && <p className="save">Together they&rsquo;re {inr(moreRegular - moreTotal)} less than the regular price.</p>}
              </section>
            )}
          </div>

          <aside className="cartbox" ref={summaryRef}>
            <h2>Summary</h2>
            <dl className="sum">
              <dt>Subtotal ({cart.items.length} course{cart.items.length === 1 ? "" : "s"})</dt><dd>{inr(cart.subtotal)}</dd>
              {cart.coupon && (<><dt>Coupon {cart.coupon.code}</dt><dd>−{inr(cart.coupon.discount)}</dd></>)}
              {cart.mudra_discount > 0 && (<><dt>Mudras ({cart.mudras_applied} applied)</dt><dd>−{inr(cart.mudra_discount)}</dd></>)}
              <dt className="tot">Total</dt><dd className="tot">{inr(cart.total)}</dd>
            </dl>
            {savings > 0 && <p className="save">You save {inr(savings)} against the regular price.</p>}
            <button className="acct-btn dark" disabled={busy !== null || cart.items.length === 0} onClick={pay}>
              {busy === "pay" ? "Opening payment…" : cart.total > 0 ? `Pay ${inr(cart.total)}` : "Pre-register with mudras"}
            </button>
            <p className="muted small">Secure payment by Razorpay: UPI, cards or net banking. Mudras are applied automatically (10 mudras = ₹1). Prices include GST.</p>
          </aside>
        </div>
      )}
    {cart && cart.items.length > 0 && (
        <div className={`paybar${summaryShown ? " gone" : ""}`}>
          <b>{inr(cart.total)}</b>
          <button onClick={() => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })}>Pay now</button>
        </div>
      )}
    </div>
  );
}
