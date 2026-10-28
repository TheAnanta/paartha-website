"use client";

import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { openCheckout } from "@/lib/razorpay";
import { addToCart, type Cart, type Course, getCart, listCourses, PLAN, signUp, startPayment, startSession, verifyPayment } from "@/lib/student";

const SUPPORT = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "paartha@theananta.in";
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null);
/** What the app's sheet shows as the description: the first sentence, up to " of both". */
const blurb = (c: Course) => `${c.description.split(" of both")[0].replace(/\.$/, "")}.`;
const availability = (iso: string | null) => (iso ? `Course available from ${day(iso)}` : "Course available soon");

type Phase = "loading" | "signedOut" | "signUp" | "blocked" | "ready" | "error";

export default function CoursesClient() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [blocked, setBlocked] = useState("");
  const [paid, setPaid] = useState<Course[] | null>(null);

  const loadAll = useCallback(async (u: User) => {
    const token = await u.getIdToken();
    const [cs, ct] = await Promise.all([listCourses(token), getCart(token)]);
    setCourses(cs);
    setCart(ct);
  }, []);

  const begin = useCallback(async (u: User) => {
    setPhase("loading");
    try {
      const token = await u.getIdToken();
      const s = await startSession(token, u.photoURL);
      if (s.outcome === "needs_sign_up") { setPhase("signUp"); return; }
      if (s.outcome !== "signed_in") {
        setBlocked(s.outcome);
        setPhase("blocked");
        return;
      }
      await loadAll(u);
      setPhase("ready");
    } catch (e) {
      setMessage({ kind: "bad", text: e instanceof Error ? e.message : "We couldn't load your courses." });
      setPhase("error");
    }
  }, [loadAll]);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        if (u) void begin(u);
        else setPhase("signedOut");
      }),
    [begin],
  );

  async function signIn() {
    setMessage(null);
    setSigningIn(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setMessage({ kind: "bad", text: code === "auth/popup-blocked" ? "Your browser blocked the sign-in window. Allow pop-ups for this site and try again." : `We couldn't sign you in. Please try again. (${code})` });
      }
    } finally {
      setSigningIn(false);
    }
  }

  async function register(name: string, roll: string, invitedBy: string) {
    if (!user) return;
    setMessage(null);
    setBusy("signup");
    try {
      await signUp(await user.getIdToken(), { name, roll_number: roll, invited_by: invitedBy, photo_url: user.photoURL });
      await begin(user);
    } catch (e) {
      setMessage({ kind: "bad", text: e instanceof Error ? e.message : "We couldn't create your account." });
    } finally {
      setBusy(null);
    }
  }

  async function add(ids: string[]) {
    if (!user) return;
    setMessage(null);
    setBusy(ids.join(","));
    try {
      const token = await user.getIdToken();
      let next: Cart | null = null;
      for (const id of ids) next = await addToCart(token, id);
      if (next) setCart(next);
    } catch (e) {
      setMessage({ kind: "bad", text: e instanceof Error ? e.message : "We couldn't add that course." });
    } finally {
      setBusy(null);
    }
  }

  async function pay() {
    if (!user || !cart || cart.items.length === 0) return;
    setMessage(null);
    setBusy("pay");
    try {
      const token = await user.getIdToken();
      const p = await startPayment(token);
      const bought = cart.items;
      if (p.amount > 0 && p.razorpay_order_id && p.razorpay_key_id) {
        const r = await openCheckout({ keyId: p.razorpay_key_id, orderId: p.razorpay_order_id, amountRupees: p.amount, description: `Pre-registration: ${bought.length} course${bought.length > 1 ? "s" : ""}`, email: user.email ?? undefined, name: user.displayName ?? undefined });
        if (r.status === "closed") return;
        if (r.status === "failed") { setMessage({ kind: "bad", text: r.message }); return; }
        await verifyPayment(token, p.payment_id, { razorpay_payment_id: r.paymentId, razorpay_signature: r.signature });
      } else if (p.amount > 0) {
        await verifyPayment(token, p.payment_id, {}); // a test server that takes no payment
      } // else mudras covered everything and the server has already completed it
      setPaid(bought);
      await loadAll(user);
    } catch (e) {
      setMessage({ kind: "bad", text: e instanceof ApiError || e instanceof Error ? e.message : "The payment didn't go through." });
    } finally {
      setBusy(null);
    }
  }

  const inCart = useMemo(() => new Set(cart?.items.map((i) => i.id) ?? []), [cart]);
  const open = courses.filter((c) => !c.purchased);
  const mine = courses.filter((c) => c.purchased);
  const grouped = useMemo(() => {
    const m = new Map<string, Course[]>();
    for (const c of open) m.set(c.category, [...(m.get(c.category) ?? []), c]);
    return [...m.entries()];
  }, [open]);
  const suggestions = open.filter((c) => !inCart.has(c.id)).slice(0, 3);

  if (phase === "loading") return <p className="muted" style={{ marginTop: 40 }}>Loading…</p>;

  if (phase === "signedOut")
    return (
      <section className="acct-card" style={{ maxWidth: 560, margin: "48px auto" }}>
        <h2>Pre-register for Paartha</h2>
        <p className="muted">Sign in with the Google account you use (or will use) for Paartha. We&rsquo;ll set up your account and show you your courses.</p>
        {message && <p className={`acct-msg ${message.kind}`}>{message.text}</p>}
        <button className="acct-btn dark" disabled={signingIn} onClick={signIn}>Continue with Google</button>
      </section>
    );

  if (phase === "signUp")
    return <SignUpForm user={user!} busy={busy === "signup"} message={message} onSubmit={register} onCancel={() => signOut(auth)} />;

  if (phase === "blocked")
    return (
      <section className="acct-card" style={{ maxWidth: 560, margin: "48px auto" }}>
        <h2>Pre-order from the app</h2>
        <p className="muted">
          {user?.email} is already signed in on a phone{blocked === "device_exhausted" ? ", and its device changes have all been used" : ""}. To keep your phone signed in, pre-register in the Paartha app, where this same offer is open.
          {blocked === "device_exhausted" ? <> Need help? Write to <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>.</> : null}
        </p>
        <a className="acct-btn dark" style={{ textDecoration: "none", display: "grid", placeItems: "center" }} href="/#download">Get the app</a>
        <button className="acct-btn" onClick={() => signOut(auth)}>Sign out</button>
      </section>
    );

  if (phase === "error")
    return (
      <section className="acct-card" style={{ maxWidth: 560, margin: "48px auto" }}>
        <h2>Something went wrong</h2>
        {message && <p className="acct-msg bad">{message.text}</p>}
        <button className="acct-btn dark" onClick={() => user && begin(user)}>Try again</button>
        <button className="acct-btn" onClick={() => signOut(auth)}>Sign out</button>
      </section>
    );

  const availableOn = day(open.find((c) => c.available_from)?.available_from ?? mine.find((c) => c.available_from)?.available_from ?? null);

  if (paid)
    return (
      <section className="acct-card" style={{ maxWidth: 620, margin: "48px auto" }}>
        <p className="eyebrow" style={{ color: "var(--couture)", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", fontSize: 13, margin: "0 0 8px" }}>You&rsquo;re pre-registered</p>
        <h2 style={{ fontSize: 32 }}>Payment received. Thank you!</h2>
        <ul className="history">
          {paid.map((c) => (<li key={c.id}><b>{c.title}</b><em>{c.code}</em><span /></li>))}
        </ul>
        <p className="muted">{availableOn ? `Your courses open on ${availableOn}.` : "Your courses open soon."} We&rsquo;ll notify you in the Paartha app when they do. Sign in to the app with this same Google account ({user?.email}).</p>
        <button className="acct-btn dark" onClick={() => setPaid(null)}>Back to courses</button>
      </section>
    );

  const savings = (cart?.items ?? []).reduce((s, c) => s + Math.max(0, c.regular_price - c.price), 0);
  const sugTotal = suggestions.reduce((s, c) => s + c.price, 0);
  const sugRegular = suggestions.reduce((s, c) => s + c.regular_price, 0);

  return (
    <>
      <div className="acct-hero" style={{ marginTop: 24 }}>
        <div>
          <h1 style={{ fontSize: 40, letterSpacing: -1, margin: 0 }}>Pre-register your battle plan</h1>
          <p className="muted" style={{ margin: 0 }}>Hi {user?.displayName?.split(" ")[0] ?? "there"}, these are your courses.</p>
        </div>
        <button className="acct-link" onClick={() => signOut(auth)}>Sign out</button>
      </div>

      <section className="acct-card prereg">
        <p className="label">{PLAN.name} · {PLAN.tag}</p>
        <h2>What you get when you pre-register</h2>
        <p className="muted">{availableOn ? `Course content opens on ${availableOn}.` : "Course content opens soon."} Pay now at the pre-registration price; every unit stays locked until then, and you&rsquo;ll be notified in the app when your course opens.</p>
        <ul className="feat">{PLAN.features.map((f) => (<li key={f}>{f}</li>))}</ul>
        <p className="muted small">Mudras are applied to your order automatically (10 mudras = ₹1): promotional mudras cover up to 250 mudras (₹25) of each course, and mudras you earned by effort can cover more. Prices include GST.</p>
      </section>

      {message && <p className={`acct-msg ${message.kind}`}>{message.text}</p>}

      <div className="shop">
        <div>
          {grouped.length === 0 && <p className="muted">No courses are open for pre-registration right now.</p>}
          {grouped.map(([category, list]) => (
            <section key={category}>
              <h2 className="section" style={{ marginTop: 28 }}>{category}</h2>
              <div className="clist">
                {list.map((c) => (
                  <article className="ccard" key={c.id}>
                    <div className="ctop"><span className="tag">{c.code}</span><span className="tag out">{PLAN.tag}</span></div>
                    <h3>{c.title}</h3>
                    <p className="muted small">{blurb(c)}</p>
                    <p className="avail">{availability(c.available_from)}</p>
                    <div className="cbuy">
                      <div className="price">
                        <b>{inr(c.price)}</b>
                        {c.regular_price > c.price && <s>{inr(c.regular_price)}</s>}
                      </div>
                      {inCart.has(c.id)
                        ? <span className="inbag">In your cart ✓</span>
                        : <button className="pill" disabled={busy !== null} onClick={() => add([c.id])}>{busy === c.id ? "Adding…" : "Pre-order"}</button>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
          {mine.length > 0 && (
            <section>
              <h2 className="section" style={{ marginTop: 28 }}>Already yours</h2>
              <div className="clist">
                {mine.map((c) => (
                  <article className="ccard done" key={c.id}>
                    <div className="ctop"><span className="tag">{c.code}</span></div>
                    <h3>{c.title}</h3>
                    <p className="avail">{c.pre_registration ? `You’re pre-registered. ${availability(c.available_from)}` : "You own this course. Open it in the app."}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="cartbox">
          <h2>Your cart</h2>
          {!cart || cart.items.length === 0 ? <p className="muted">Pick a course to pre-order it.</p> : (
            <>
              <ul className="history">
                {cart.items.map((c) => (<li key={c.id}><span>{c.title}</span><em>{c.regular_price > c.price ? <s>{inr(c.regular_price)}</s> : null}</em><b>{inr(c.price)}</b></li>))}
              </ul>
              <dl className="sum">
                <dt>Subtotal</dt><dd>{inr(cart.subtotal)}</dd>
                {cart.coupon && (<><dt>Coupon {cart.coupon.code}</dt><dd>−{inr(cart.coupon.discount)}</dd></>)}
                {cart.mudra_discount > 0 && (<><dt>Mudras ({cart.mudras_applied} applied)</dt><dd>−{inr(cart.mudra_discount)}</dd></>)}
                <dt className="tot">Total</dt><dd className="tot">{inr(cart.total)}</dd>
              </dl>
              {savings > 0 && <p className="save">You save {inr(savings)} against the regular price.</p>}
              <button className="acct-btn dark" disabled={busy !== null} onClick={pay}>{busy === "pay" ? "Opening payment…" : cart.total > 0 ? `Pay ${inr(cart.total)}` : "Pre-register with mudras"}</button>
              <p className="muted small">Secure payment by Razorpay: UPI, cards or net banking.</p>
            </>
          )}

          {suggestions.length > 0 && (
            <div className="upsell">
              <h3>Add more courses</h3>
              <p className="muted small">Students usually pre-register for the whole semester. Add these and lock in the pre-registration price.</p>
              {suggestions.map((c) => (
                <div className="sug" key={c.id}>
                  <div><b>{c.title}</b><span className="muted small">{inr(c.price)}{c.regular_price > c.price && <> <s>{inr(c.regular_price)}</s></>}</span></div>
                  <button className="pill ghost" disabled={busy !== null} onClick={() => add([c.id])}>Add</button>
                </div>
              ))}
              {suggestions.length > 1 && (
                <button className="acct-btn" disabled={busy !== null} onClick={() => add(suggestions.map((c) => c.id))}>
                  {busy === suggestions.map((c) => c.id).join(",") ? "Adding…" : `Add all ${suggestions.length} for ${inr(sugTotal)}`}
                </button>
              )}
              {sugRegular > sugTotal && <p className="save">Together they&rsquo;re {inr(sugRegular - sugTotal)} less than the regular price.{cart && cart.items.length > 0 ? ` Your cart would total ${inr(cart.subtotal + sugTotal)}.` : ""}</p>}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

function SignUpForm({ user, busy, message, onSubmit, onCancel }: { user: User; busy: boolean; message: { kind: "ok" | "bad"; text: string } | null; onSubmit: (name: string, roll: string, invitedBy: string) => void; onCancel: () => void }) {
  const [name, setName] = useState(user.displayName ?? "");
  const [roll, setRoll] = useState("");
  const [invite, setInvite] = useState("");
  const ok = name.trim().length > 0 && roll.trim().length >= 3;
  return (
    <form className="acct-card" style={{ maxWidth: 560, margin: "48px auto" }} onSubmit={(e) => { e.preventDefault(); if (ok) onSubmit(name.trim(), roll.trim(), invite.trim().replace(/^@/, "")); }}>
      <h2>Create your Paartha account</h2>
      <p className="muted">Signed in as {user.email}. Two details and you&rsquo;re in; use the same Google account in the app later.</p>
      {message && <p className={`acct-msg ${message.kind}`}>{message.text}</p>}
      <label className="fld">Your name<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
      <label className="fld">Roll number<input value={roll} onChange={(e) => setRoll(e.target.value)} autoCapitalize="characters" placeholder="e.g. VU21CSEN0100000" /></label>
      <label className="fld">Friend&rsquo;s username <span className="muted">(optional)</span><input value={invite} onChange={(e) => setInvite(e.target.value)} autoCapitalize="none" /></label>
      <button className="acct-btn dark" type="submit" disabled={!ok || busy}>{busy ? "Creating your account…" : "Continue"}</button>
      <button className="acct-btn" type="button" onClick={onCancel}>Use a different account</button>
    </form>
  );
}
