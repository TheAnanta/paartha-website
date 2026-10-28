"use client";

import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signUp, startSession } from "@/lib/student";

type Phase = "loading" | "signedOut" | "signUp" | "ready" | "error";
type Msg = { kind: "ok" | "bad"; text: string };

/** Signs the visitor in with Google, registers them if they are new (the app's own /auth calls), then shows `children`. */
export default function StudentGate({ children }: { children: (user: User) => ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<Msg | null>(null);
  const [busy, setBusy] = useState(false);

  const begin = useCallback(async (u: User) => {
    setPhase("loading");
    try {
      const s = await startSession(await u.getIdToken(), u.photoURL);
      setPhase(s.outcome === "needs_sign_up" ? "signUp" : "ready");
    } catch (e) {
      setMessage({ kind: "bad", text: e instanceof Error ? e.message : "We couldn't load your account." });
      setPhase("error");
    }
  }, []);

  useEffect(
    () => onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) void begin(u);
      else setPhase("signedOut");
    }),
    [begin],
  );

  async function signIn() {
    setMessage(null);
    setBusy(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setMessage({ kind: "bad", text: code === "auth/popup-blocked" ? "Your browser blocked the sign-in window. Allow pop-ups for this site and try again." : `We couldn't sign you in. Please try again. (${code})` });
      }
    } finally {
      setBusy(false);
    }
  }

  async function register(name: string, roll: string, invitedBy: string) {
    if (!user) return;
    setMessage(null);
    setBusy(true);
    try {
      await signUp(await user.getIdToken(), { name, roll_number: roll, invited_by: invitedBy, photo_url: user.photoURL });
      await begin(user);
    } catch (e) {
      setMessage({ kind: "bad", text: e instanceof Error ? e.message : "We couldn't create your account." });
    } finally {
      setBusy(false);
    }
  }

  if (phase === "loading") return <p className="muted" style={{ marginTop: 40 }}>Loading…</p>;
  if (phase === "ready" && user) return <>{children(user)}</>;

  if (phase === "signedOut")
    return (
      <section className="acct-card" style={{ maxWidth: 560, margin: "48px auto" }}>
        <h2>Pre-register for Paartha</h2>
        <p className="muted">Sign in with the Google account you use (or will use) for Paartha. We&rsquo;ll set up your account and show you your courses.</p>
        {message && <p className={`acct-msg ${message.kind}`}>{message.text}</p>}
        <button className="acct-btn dark" disabled={busy} onClick={signIn}>Continue with Google</button>
      </section>
    );

  if (phase === "signUp" && user) return <SignUpForm user={user} busy={busy} message={message} onSubmit={register} />;

  return (
    <section className="acct-card" style={{ maxWidth: 560, margin: "48px auto" }}>
      <h2>Something went wrong</h2>
      {message && <p className="acct-msg bad">{message.text}</p>}
      <button className="acct-btn dark" onClick={() => user && begin(user)}>Try again</button>
      <button className="acct-btn" onClick={() => signOut(auth)}>Sign out</button>
    </section>
  );
}

function SignUpForm({ user, busy, message, onSubmit }: { user: User; busy: boolean; message: Msg | null; onSubmit: (name: string, roll: string, invitedBy: string) => void }) {
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
      <button className="acct-btn" type="button" onClick={() => signOut(auth)}>Use a different account</button>
    </form>
  );
}
