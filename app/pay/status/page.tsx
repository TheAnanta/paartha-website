import { Suspense } from "react";
import PayStatusClient from "@/components/PayStatusClient";

export const metadata = { title: "Payment status", robots: { index: false } };

export default function PayStatus() {
  return <Suspense><PayStatusClient /></Suspense>;
}
