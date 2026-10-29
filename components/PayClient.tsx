"use client";

import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PaymentLoading } from "@/components/PaymentScreens";
import StudentGate from "@/components/StudentGate";
import { openCheckout } from "@/lib/razorpay";
import { getCheckout, verifyPayment } from "@/lib/student";

/**
 * /pay/<payment id>: opened by the desktop app in a webview. Shows the app's loading screen, opens Razorpay at once for the
 * payment's order, then goes to /pay/status. The host passes a Firebase ID token in the URL fragment (#token=...), which is never
 * sent to a server; without one, the visitor signs in with Google as on the rest of the site.
 */
export default function PayClient({ paymentId }: { paymentId: string }) {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    const m = /[#&]token=([^&]+)/.exec(window.location.hash);
    if (m) {
      setToken(decodeURIComponent(m[1]));
      history.replaceState(null, "", window.location.pathname + window.location.search);
    } else setToken(null);
  }, []);
  if (token === undefined) return <PaymentLoading paymentId={paymentId} />;
  if (token) return <Runner paymentId={paymentId} getToken={async () => token} />;
  return <StudentGate>{(user: User) => <Runner paymentId={paymentId} getToken={() => user.getIdToken()} email={user.email ?? undefined} name={user.displayName ?? undefined} />}</StudentGate>;
}

function Runner({ paymentId, getToken, email, name }: { paymentId: string; getToken: () => Promise<string>; email?: string; name?: string }) {
  const router = useRouter();
  const started = useRef(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const done = (result: "success" | "failure", code?: string) =>
      router.replace(`/pay/status?result=${result}&paymentId=${encodeURIComponent(paymentId)}${code ? `&code=${encodeURIComponent(code)}` : ""}`);
    (async () => {
      try {
        const t = await getToken();
        const co = await getCheckout(t, paymentId);
        if (co.status === "successful") return done("success");
        if (co.status === "failed") return done("failure", "payment_failed");
        if (co.razorpay_order_id && co.razorpay_key_id) {
          const r = await openCheckout({ keyId: co.razorpay_key_id, orderId: co.razorpay_order_id, amountRupees: co.amount, description: "Paartha courses", email, name });
          if (r.status === "closed") return done("failure", "cancelled");
          if (r.status === "failed") return done("failure", "payment_failed");
          const rec = await verifyPayment(t, paymentId, { razorpay_payment_id: r.paymentId, razorpay_signature: r.signature });
          return rec.status === "successful" ? done("success") : done("failure", `payment_${rec.status}`);
        }
        // No gateway order (a test server, or mudras covered it): the server just needs asking.
        const rec = await verifyPayment(t, paymentId, {});
        return rec.status === "successful" ? done("success") : done("failure", `payment_${rec.status}`);
      } catch (e) {
        const code = (e as { code?: string }).code;
        setMessage(e instanceof Error ? e.message : "");
        done("failure", code && code !== "error" ? code : "payment_failed");
      }
    })();
  }, [paymentId, getToken, router, email, name]);
  return <PaymentLoading paymentId={paymentId} />;
}
