import CartClient from "@/components/CartClient";
import { Footer, Header } from "@/components/Chrome";

export const metadata = { title: "Your cart" };

export default function Cart() {
  return (
    <>
      <Header cta={false} />
      <main className="wrap">
        <CartClient />
      </main>
      <Footer />
    </>
  );
}
