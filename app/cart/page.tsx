import CartClient from "@/components/CartClient";
import { Footer, Header } from "@/components/Chrome";

export const metadata = { title: "Your cart" };

export default function Cart() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 980 }}>
        <CartClient />
      </main>
      <Footer />
    </>
  );
}
