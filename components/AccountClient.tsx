"use client";

import { GoogleAuthProvider, OAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { type Account, ApiError, createOrder, getAccount, verifyOrder } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { openCheckout } from "@/lib/razorpay";

const SUPPORT = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "paartha@theananta.in";
const fmt = (n: number) => n.toLocaleString("en-IN");
const joined = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

type Phase = "loading" | "signedOut" | "ready" | "notRegistered" | "error";

export default function AccountClient() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const load = useCallback(async (u: User) => {
    try {
      const token = await u.getIdToken();
      const a = await getAccount(token);
      setAccount(a);
      setSelected((s) => s ?? a.packs[0]?.id ?? null);
      setPhase("ready");
    } catch (e) {
      if (e instanceof ApiError && (e.status === 403 || e.status === 404)) setPhase("notRegistered");
      else if (e instanceof ApiError && e.status === 401) setPhase("signedOut");
      else {
        setMessage({ kind: "bad", text: e instanceof Error ? e.message : "We couldn't load your account." });
        setPhase("error");
      }
    }
  }, []);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        if (u) void load(u);
        else { setAccount(null); setPhase("signedOut"); }
      }),
    [load],
  );

  async function signIn(provider: "google" | "apple") {
    setMessage(null);
    setSigningIn(true);
    try {
      if (provider === "google") await signInWithPopup(auth, new GoogleAuthProvider());
      else {
        const apple = new OAuthProvider("apple.com");
        apple.addScope("email");
        apple.addScope("name");
        await signInWithPopup(auth, apple);
      }
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") setMessage({ kind: "bad", text: "We couldn't sign you in. Please try again." });
    } finally {
      setSigningIn(false);
    }
  }

  async function buy() {
    if (!user || !account || !selected) return;
    setMessage(null);
    setBuying(selected);
    try {
      const token = await user.getIdToken();
      const order = await createOrder(token, selected);
      if (order.razorpay_order_id && order.razorpay_key_id) {
        const r = await openCheckout({ keyId: order.razorpay_key_id, orderId: order.razorpay_order_id, amountRupees: order.amount, description: `${fmt(order.mudras)} mudras`, email: account.email, name: account.name });
        if (r.status === "closed") return;
        if (r.status === "failed") { setMessage({ kind: "bad", text: r.message }); return; }
        await verifyOrder(token, order.purchase_id, { razorpay_payment_id: r.paymentId, razorpay_signature: r.signature });
      } else {
        await verifyOrder(token, order.purchase_id, {}); // a test server that takes no payment
      }
      setMessage({ kind: "ok", text: `${fmt(order.mudras)} mudras were added to your account.` });
      await load(user);
    } catch (e) {
      setMessage({ kind: "bad", text: e instanceof Error ? e.message : "The payment didn't go through." });
    } finally {
      setBuying(null);
    }
  }

  if (phase === "loading") return <p className="muted">Loading…</p>;

  if (phase === "signedOut")
    return (
      <section className="acct-card">
        <h2>Sign in</h2>
        <p className="muted">Use the same Google or Apple account you use for Paartha.</p>
        {message && <p className={`acct-msg ${message.kind}`}>{message.text}</p>}
        <button className="acct-btn dark" disabled={signingIn} onClick={() => signIn("google")}>Continue with Google</button>
        <button className="acct-btn" disabled={signingIn} onClick={() => signIn("apple")}>Continue with Apple</button>
      </section>
    );

  if (phase === "notRegistered")
    return (
      <section className="acct-card">
        <h2>We couldn&rsquo;t find a Paartha account</h2>
        <p className="muted">{user?.email ?? "This sign-in"} isn&rsquo;t registered with Paartha yet. Sign in with the account you registered with, or write to <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>.</p>
        <button className="acct-btn" onClick={() => signOut(auth)}>Sign out</button>
      </section>
    );

  if (phase === "error" || !account)
    return (
      <section className="acct-card">
        <h2>Something went wrong</h2>
        {message && <p className="acct-msg bad">{message.text}</p>}
        <button className="acct-btn dark" onClick={() => user && load(user)}>Try again</button>
        <button className="acct-btn" onClick={() => signOut(auth)}>Sign out</button>
      </section>
    );

  const pack = account.packs.find((p) => p.id === selected);
  return (
    <>
      <section className="acct-hero">
        <div className="avatar">{account.image ? <img src={account.image} alt="" /> : <span>{account.name.slice(0, 1).toUpperCase()}</span>}</div>
        <div>
          <h2>{account.name}</h2>
          <p className="muted">Joined in {joined(account.joined_at)}</p>
        </div>
        <button className="acct-link" onClick={() => signOut(auth)}>Sign out</button>
      </section>

      {message && <p className={`acct-msg ${message.kind}`}>{message.text}</p>}

      <section className="acct-grid">
        <div className="acct-card mudras">
          <p className="label">Your mudras</p>
          <p className="big">{fmt(account.mudras)}</p>
          <p className="muted small">
            {fmt(account.earned_mudras)} earned by studying{account.promotional_mudras > 0 ? ` · ${fmt(account.promotional_mudras)} promotional` : ""}
          </p>
        </div>
        <div className="acct-card">
          <p className="label">Your details</p>
          <dl>
            <dt>Email</dt><dd>{account.email}</dd>
            {account.username && (<><dt>Username</dt><dd>@{account.username}</dd></>)}
            <dt>Semester</dt><dd>{account.semester}</dd>
            <dt>Courses</dt><dd>{account.courses}</dd>
          </dl>
        </div>
      </section>

      <section className="acct-card">
        <h2>Get mudras</h2>
        <p className="muted">Mudras take money off courses in Paartha. Choose a pack and pay securely with Razorpay (UPI, cards or net banking).</p>
        <div className="packs">
          {account.packs.map((p) => (
            <button key={p.id} className={`pack${p.id === selected ? " on" : ""}`} onClick={() => setSelected(p.id)} disabled={buying !== null}>
              <b>{fmt(p.mudras)}</b>
              <span>mudras</span>
              <em>₹{fmt(p.price)}</em>
            </button>
          ))}
        </div>
        <button className="acct-btn dark" disabled={!pack || buying !== null} onClick={buy}>
          {buying ? "Opening payment…" : pack ? `Pay ₹${fmt(pack.price)}` : "Choose a pack"}
        </button>
        <p className="muted small">Mudras have no cash value and can&rsquo;t be withdrawn or transferred. See the <a href="/terms#5-mudras">Terms</a>.</p>
      </section>

      {account.purchases.length > 0 && (
        <section className="acct-card">
          <h2>Your purchases</h2>
          <ul className="history">
            {account.purchases.map((p) => (
              <li key={p.id}>
                <span>{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                <b>{fmt(p.mudras)} mudras</b>
                <em>₹{fmt(p.amount)}</em>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
