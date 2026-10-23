import { Footer, Header, SUPPORT_EMAIL } from "@/components/Chrome";

export const metadata = { title: "Manage your account" };

export default function Account() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 680 }}>
        <h1 style={{ fontSize: 40, letterSpacing: -1 }}>Manage your account</h1>
        <p style={{ color: "var(--muted)" }}>
          Account sign-in on the web is coming soon. Until then, to change anything on your account, write to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the email you sign in to Paartha with, or open a ticket from the Support tab in the app.
        </p>
      </main>
      <Footer />
    </>
  );
}
