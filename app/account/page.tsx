import AccountClient from "@/components/AccountClient";
import { Footer, Header } from "@/components/Chrome";

export const metadata = { title: "Your account" };

export default function Account() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 760 }}>
        <h1 style={{ fontSize: 40, letterSpacing: -1 }}>Your account</h1>
        <AccountClient />
      </main>
      <Footer />
    </>
  );
}
