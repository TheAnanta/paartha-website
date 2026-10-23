import { Footer, Header } from "@/components/Chrome";
import Link from "next/link";

const APP_STORE = process.env.NEXT_PUBLIC_APP_STORE_URL;
const PLAY_STORE = process.env.NEXT_PUBLIC_PLAY_STORE_URL;

const features = [
  { t: "Notes", d: "Handwritten, exam-focused notes you can read in the app, with a table of contents and bookmarks." },
  { t: "Important questions", d: "Sorted by marks, per unit, so you spend your time where the marks are." },
  { t: "Cheatsheets and flashcards", d: "Fast-prep sheets and flashcards for the night before the exam." },
  { t: "Quizzes", d: "Five fresh questions every attempt. Ace it and earn mudras." },
  { t: "Mind maps", d: "See how topics connect, tap a node to read the definition and an example." },
  { t: "Study plan", d: "A week plan that puts the most useful resources first when your exam is close." },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="wrap">
        <section className="hero">
          <div>
            <h1>Hack through your schedules.</h1>
            <p>Notes, important questions, cheatsheets, flashcards and quizzes for every unit, so you always know what to study next, even the night before an exam.</p>
            {APP_STORE && <a className="btn" href={APP_STORE}>Download on the App Store</a>}
            {PLAY_STORE && <a className="btn ghost" href={PLAY_STORE}>Get it on Google Play</a>}
            {!APP_STORE && !PLAY_STORE && <Link className="btn" href="/support">Need help?</Link>}
          </div>
          <div className="art">Hero artwork goes here</div>
        </section>

        <h2 className="section">Everything for an exam you are sure to ace</h2>
        <div className="grid">
          {features.map((f) => (
            <div className="card" key={f.t}><h3>{f.t}</h3><p>{f.d}</p></div>
          ))}
        </div>

        <h2 className="section">Mudras: earn them by learning</h2>
        <p style={{ color: "var(--muted)", maxWidth: 640 }}>
          Mudras are Paartha&apos;s virtual currency. Studying earns them, and they take money off courses. Some are promotional, some are earned by effort. Terms apply.
        </p>
      </main>
      <Footer />
    </>
  );
}
