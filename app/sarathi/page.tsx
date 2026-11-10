import "../home.css";
import { Footer, Header } from "@/components/Chrome";
import PersonCard from "@/components/PersonCard";
import { SARATHI, slugify } from "@/content/sarathi";

export const metadata = {
  title: "Team Sarathi",
  description: "Sarathi: the team behind Paartha, the exam prep app for GITAM students.",
  alternates: { canonical: "/sarathi" },
};

export default function SarathiPage() {
  return (
    <>
      <Header />
      <main className="wrap hv pagehead">
        <h1 className="h2">Team</h1>
        <p className="sub">Sarathi: the people behind Paartha.</p>
        <div className="pgrid">
          {SARATHI.map((m, i) => (<PersonCard p={m} i={i} href={`/sarathi/${slugify(m.name)}`} key={m.name} team />))}
        </div>
      </main>
      <Footer />
    </>
  );
}
