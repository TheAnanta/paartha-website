import "../home.css";
import { Footer, Header } from "@/components/Chrome";
import PersonCard from "@/components/PersonCard";
import { EDUCATORS, slugify } from "@/content/educators";

export const metadata = {
  title: "Educators",
  description: "Meet the students and alumni who write and review every Paartha course, from first year to final year.",
  alternates: { canonical: "/educators" },
};

export default function EducatorsPage() {
  return (
    <>
      <Header />
      <main className="wrap hv pagehead">
        <h1 className="h2">Meet our Educators</h1>
        <p className="sub">Every course is written and reviewed by students and alumni who have been through these exact courses, so it comes from people who know the exam, not from a template.</p>
        <div className="pgrid">
          {EDUCATORS.map((e, i) => (<PersonCard p={e} i={i} href={`/educators/${slugify(e.name)}`} key={e.name} />))}
        </div>
      </main>
      <Footer />
    </>
  );
}
