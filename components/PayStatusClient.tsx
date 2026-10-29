"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { PaymentFailure, PaymentSuccess } from "@/components/PaymentScreens";
import { reportToHost } from "@/lib/hostBridge";

/** /pay/status?result=success|failure&paymentId=...[&code=...]: the app's success or failure screen, and the result reported to the host. */
export default function PayStatusClient() {
  const q = useSearchParams();
  const paymentId = q.get("paymentId") ?? "";
  const success = q.get("result") === "success";
  const code = q.get("code") ?? "payment_failed";
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    reportToHost({ status: success ? "success" : "failure", paymentId, ...(success ? {} : { code }) });
  }, [success, paymentId, code]);
  return success ? <PaymentSuccess paymentId={paymentId} /> : <PaymentFailure code={code} paymentId={paymentId} retryHref={paymentId ? `/pay/${encodeURIComponent(paymentId)}` : "/cart"} />;
}
