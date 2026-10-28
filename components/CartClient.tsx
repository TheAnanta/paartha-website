"use client";

import { signOut, type User } from "firebase/auth";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import StudentGate from "@/components/StudentGate";
import { availability, day, inr, Members, Thumb } from "@/components/shop";
import { auth } from "@/lib/firebase";
import { openCheckout } from "@/lib/razorpay";
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
  const [paid, setPaid] = useState<Course[] | null>(null);
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

  async function pay() {
    if (!cart || cart.items.length === 0) return;
    setError("");
    setBusy("pay");
    try {
      const token = await user.getIdToken();
      const bought = cart.items;
      const p = await startPayment(token);
      if (p.amount > 0 && p.razorpay_order_id && p.razorpay_key_id) {
        const r = await openCheckout({ keyId: p.razorpay_key_id, orderId: p.razorpay_order_id, amountRupees: p.amount, description: `Pre-registration: ${bought.length} course${bought.length > 1 ? "s" : ""}`, email: user.email ?? undefined, name: user.displayName ?? undefined });
        if (r.status === "closed") return;
        if (r.status === "failed") { setError(r.message); return; }
        await verifyPayment(token, p.payment_id, { razorpay_payment_id: r.paymentId, razorpay_signature: r.signature });
      } else if (p.amount > 0) {
        await verifyPayment(token, p.payment_id, {}); // a test server that takes no payment
      } // else mudras covered everything and the server has already completed it
      setPaid(bought);
      await load().catch(() => undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The payment didn't go through.");
    } finally {
      setBusy(null);
    }
  }

  if (paid) {
    const on = day(paid.find((c) => c.available_from)?.available_from ?? null);
    return (
      <section className="acct-card" style={{ maxWidth: 620, margin: "48px auto" }}>
        <p className="eyebrow" style={{ color: "var(--couture)", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", fontSize: 13, margin: "0 0 8px" }}>You&rsquo;re pre-registered</p>
        <h2 style={{ fontSize: 32 }}>Payment received. Thank you!</h2>
        <ul className="history">{paid.map((c) => (<li key={c.id}><b>{c.title}</b><em>{c.code}</em><span /></li>))}</ul>
        <p className="muted">{on ? `Your courses open on ${on}.` : "Your courses open soon."} We&rsquo;ll notify you in the Paartha app when they do. Sign in to the app with this same Google account ({user.email}).</p>
        <Link className="acct-btn dark" style={{ textDecoration: "none", display: "grid", placeItems: "center" }} href="/courses">Back to courses</Link>
      </section>
    );
  }

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
