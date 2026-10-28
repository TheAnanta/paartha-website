"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";

/** Asks the visitor to sign in with Google (as the app does), then lands them on their courses to pre-order. */
export default function PreRegisterButton({ light = false }: { light?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setError("");
    if (auth.currentUser) { router.push("/courses"); return; }
    setBusy(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/courses");
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code === "auth/popup-blocked") router.push("/courses"); // the page there has its own sign-in button
      else if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") setError(`We couldn't sign you in. Please try again. (${code})`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button className={light ? "btn light" : "btn"} style={{ border: 0, font: "inherit", fontWeight: 600, cursor: "pointer" }} disabled={busy} onClick={go}>
        {busy ? "Signing you in…" : "Pre-register now"}
      </button>
      {error && <p className="acct-msg bad">{error}</p>}
    </div>
  );
}
