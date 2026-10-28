import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import PreRegisterButton from "@/components/PreRegisterButton";
import Stores from "@/components/Stores";
import Strip from "@/components/Strip";
import { CalendarCheck, ClipboardCheck, FileText, ListChecks, Network, Zap } from "lucide-react";
import { FAQ } from "@/content/faq";

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
  { t: "Notes", I: FileText, d: "Exam-focused notes you read page by page, with bookmarks." },
  { t: "Important questions", I: ListChecks, d: "Grouped by marks, per unit, with model answers." },
  { t: "Cheatsheets and flashcards", I: Zap, d: "Fast-prep sheets for the night before the exam." },
  { t: "Quizzes", I: ClipboardCheck, d: "Five fresh questions each attempt, graded straight away." },
  { t: "Mind maps", I: Network, d: "See how topics connect; tap a node for the definition." },
  { t: "Study plan", I: CalendarCheck, d: "A week plan that puts the best resources first." },
];

export default function Home() {
  const faq = FAQ.flatMap((g) => g.items).filter((i) => !/stuck|ticket|refund|language/i.test(i.q)).slice(0, 8);
  return (
    <>
      <Header cta={false} />
      <main>
        <section className="wrap hero3">
          <div className="h3copy">
            <p className="eyebrow">Exam prep for university students</p>
            <h1>Know what to study next, even the night before your exam.</h1>
            <p className="lede">Notes, important questions, flashcards and quizzes for every unit, and a study plan built around your exam dates.</p>
            <PreRegisterButton />
            <p className="fine">Courses open on 1 Nov 2026. Pre-register now at a lower price.</p>
          </div>
          <div className="stage">
            <img className="hc c4" src="/home/char_4_mudras.webp" alt="" width={539} height={700} />
            <div className="ramp" />
            <div className="phone"><img src="/home/slide_1.webp" alt="The Paartha app" width={600} height={1304} /></div>
            <img className="hc c5" src="/home/char_5_breathe.webp" alt="A Paartha student pushing a phone up a ramp" width={386} height={700} />
            <img className="hc c1" src="/home/char_1_learn.webp" alt="" width={476} height={700} />
            <div className="ground" />
          </div>
        </section>

        <section className="wrap glance" aria-label="Paartha at a glance">
          <h2 className="section" style={{ marginTop: 64, marginBottom: 28 }}>Your semester, laid out</h2>
          <dl>
            <div><dt>19</dt><dd>courses to choose from</dd></div>
            <div><dt>5</dt><dd>units in every course</dd></div>
            <div><dt>5</dt><dd>kinds of study resource in every unit</dd></div>
            <div><dt>1 Nov</dt><dd>when the first courses open, in 2026</dd></div>
          </dl>
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
            <Strip images={[1, 2, 3, 4, 5, 6].map((n) => `/home/slide_${n}.webp`)} />
          </div>
        </section>

        <section className="wrap">
          <h2 className="section">What is inside every unit</h2>
          <div className="grid">
            {inside.map(({ t, d, I }) => (
              <div className="card icard" key={t}><I className="bigicon" strokeWidth={1.4} aria-hidden /><h3>{t}</h3><p>{d}</p></div>
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

        <section className="cta" id="download">
          <div className="wrap">
            <h2>Download Paartha</h2>
            <p>Your partner for exam success.</p>
            <Stores light />
            <div className="scene">
              <span className="bub b1">Exam tomorrow, 9 AM</span>
              <span className="bub b2">Where do I even start?</span>
              <span className="bub b3 ok">Important questions, by marks</span>
              <span className="bub b4 ok">The cheatsheet is ready</span>
              <img className="sceneimg" src="/home/scene.webp" alt="Six friends cramming the night before an exam, relieved as Paartha shows them what to study and a mudra shines above them" width={1600} height={900} loading="lazy" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
