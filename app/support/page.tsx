import { Footer, Header, SUPPORT_EMAIL } from "@/components/Chrome";
import { FAQ } from "@/content/faq";

export const metadata = { title: "Support" };

export default function Support() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 760 }}>
        <h1 style={{ fontSize: 40, letterSpacing: -1 }}>How can we help?</h1>
        <p style={{ color: "var(--muted)" }}>
          The fastest way is the Support tab inside the app: open a ticket and the team replies there. You can also write to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, mentioning the email you sign in with.
        </p>
        {FAQ.map((g) => (
          <section key={g.group}>
            <h2 className="section" style={{ fontSize: 22 }}>{g.group}</h2>
            {g.items.map((i) => (
              <details key={i.q}><summary>{i.q}</summary><p>{i.a}</p></details>
            ))}
          </section>
        ))}
        <h2 className="section" style={{ fontSize: 22 }}>Still stuck?</h2>
        <p>Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with your payment ID (for payment issues) and a screenshot if you can.</p>
      </main>
      <Footer />
    </>
  );
}
