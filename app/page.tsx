import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { FAQ } from "@/content/faq";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/stores";

export const metadata = {
  title: "Paartha: know what to study next",
  description: "Notes, important questions, flashcards, quizzes and a study plan for every unit of your university course.",
};

const why = [
  { img: "char_3_foryou", t: "A plan built around your exam dates", d: "Add your exams and Paartha lays out the week: the most useful things first, and the last 24 hours kept for important questions and the cheatsheet." },
  { img: "char_2_course", t: "Important questions, sorted by marks", d: "Every unit lists its important questions grouped by marks, with model answers, so you spend your time where the marks are." },
  { img: "char_6_profile", t: "See how ready you are", d: "Streaks, time spent and what is left to prepare, unit by unit, so you walk in feeling ready, not just prepared." },
  { img: "char_4_mudras", t: "Rewarded for real effort", d: "Earn mudras for a daily streak, finishing a unit or a whole course, and take them off the price of your next course." },
];

const inside = [
  { t: "Notes", d: "Exam-focused notes you read page by page, with bookmarks." },
  { t: "Important questions", d: "Grouped by marks, per unit, with model answers." },
  { t: "Cheatsheets and flashcards", d: "Fast-prep sheets for the night before the exam." },
  { t: "Quizzes", d: "Five fresh questions each attempt, graded straight away." },
  { t: "Mind maps", d: "See how topics connect; tap a node for the definition." },
  { t: "Study plan", d: "A week plan that puts the best resources first." },
];

function Stores({ light = false }: { light?: boolean }) {
  return (
    <div className="stores">
      <a className={light ? "btn light" : "btn"} href={APP_STORE_URL}>Download on the App Store</a>
      <a className={light ? "btn light ghost" : "btn ghost"} href={PLAY_STORE_URL}>Get it on Google Play</a>
    </div>
  );
}

export default function Home() {
  const faq = FAQ.flatMap((g) => g.items).filter((i) => !/stuck|ticket|refund|language/i.test(i.q)).slice(0, 8);
  return (
    <>
      <Header />
      <main>
        <section className="wrap hero2">
          <div>
            <p className="eyebrow">Exam prep for university students</p>
            <h1>Know what to study next, even the night before your exam.</h1>
            <p className="lede">Notes, important questions, flashcards and quizzes for every unit, and a study plan built around your exam dates.</p>
            <Stores />
            <p className="fine">The first unit of every course is free to try.</p>
          </div>
          <div className="art2"><img src="/home/hero.webp" alt="Two phones showing the Paartha app, with two of the Paartha students beside them" width={1400} height={1100} /></div>
        </section>

        <section className="wrap proof" aria-label="At a glance">
          <div><b>19</b><span>courses</span></div>
          <div><b>5</b><span>units in every course</span></div>
          <div><b>5</b><span>kinds of resource in every unit</span></div>
          <div><b>1 Nov</b><span>2026, when the first courses open</span></div>
        </section>

        <section className="wrap">
          <h2 className="section">Why students will love it</h2>
          <p className="lede2">Built to cut the clutter and show only what matters for your exam.</p>
          <div className="why">
            {why.map((w, i) => (
              <div className={`why-card c${i % 2}`} key={w.t}>
                <div><h3>{w.t}</h3><p>{w.d}</p></div>
                <img src={`/home/${w.img}.webp`} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <h2 className="section light">See it in action</h2>
            <p className="lede2 light">Real screens from the app.</p>
            <div className="strip" tabIndex={0} aria-label="App screenshots">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <img key={n} src={`/home/slide_${n}.webp`} alt={`Paartha app screenshot ${n} of 6`} width={600} height={1304} loading="lazy" />
              ))}
            </div>
          </div>
        </section>

        <section className="wrap">
          <h2 className="section">What is inside every unit</h2>
          <div className="grid">
            {inside.map((f) => (
              <div className="card" key={f.t}><h3>{f.t}</h3><p>{f.d}</p></div>
            ))}
          </div>
        </section>

        <section className="wrap two">
          <div>
            <h2 className="section">Who makes the content</h2>
            <p className="lede2">Every course is written around your university syllabus and prepared by the instructors who teach it, so what you revise matches what you are examined on.</p>
            <h2 className="section">Mudras: earn them by learning</h2>
            <p className="lede2">Mudras are Paartha&apos;s reward points. Study effort that adds up earns them: a daily streak, finishing five resources in a day, a completed unit or course. They take money off courses. Some are promotional, some are earned. Terms apply.</p>
          </div>
          <img className="side" src="/home/char_5_breathe.webp" alt="" loading="lazy" />
        </section>

        <section className="wrap faq2">
          <div>
            <h2 className="section">Questions, answered</h2>
            {faq.map((i) => (
              <details key={i.q}><summary>{i.q}</summary><p>{i.a}</p></details>
            ))}
            <p className="fine">More on the <Link href="/support">support page</Link>.</p>
          </div>
          <img className="side" src="/home/faq.webp" alt="" loading="lazy" />
        </section>

        <section className="cta">
          <div className="wrap">
            <h2>Download Paartha</h2>
            <p>Your partner for exam success.</p>
            <Stores light />
            <img src="/home/group.webp" alt="The six Paartha students, waving" loading="lazy" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
