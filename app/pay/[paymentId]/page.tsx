import PayClient from "@/components/PayClient";

export const metadata = { title: "Payment", robots: { index: false } };

export default async function Pay({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  return <PayClient paymentId={paymentId} />;
}
