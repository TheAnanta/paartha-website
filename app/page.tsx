import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import Stores from "@/components/Stores";
import Strip from "@/components/Strip";
import FaqList from "@/components/FaqList";
import Testimonials from "@/components/Testimonials";
import { ArrowRight, BookOpenCheck, CalendarCheck, Check, ClipboardCheck, FileText, Flame, ListChecks, Moon, Network, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { FAQ } from "@/content/faq";
import "./home.css";

export const metadata = {
  title: "Paartha: know what to study next",
  description: "Notes, important questions, flashcards, quizzes and a study plan for every unit of your university course.",
};

const needs = [
  { t: "Cram the night before", I: Moon, c: "navy" },
  { t: "Ace the sessional", I: Target, c: "red" },
  { t: "Clear a backlog", I: Flame, c: "yellow" },
  { t: "Plan my semester", I: CalendarCheck, c: "navy" },
  { t: "Get the cheatsheet", I: Zap, c: "red" },
  { t: "Earn mudras", I: Trophy, c: "yellow" },
];

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

const TICKER = ["know what to study next", "important questions by marks", "the night before, sorted", "notes · cheatsheets · quizzes", "now live on Android, iOS, macOS and Windows"];

export default function Home() {
  const faq = FAQ.flatMap((g) => g.items).filter((i) => !/stuck|ticket|refund|language/i.test(i.q)).slice(0, 8);
  return (
    <>
      <div className="topbar"><Link href="/courses">Paartha is live · Get your courses now <ArrowRight size={16} aria-hidden /></Link></div>
      <Header />
      <main className="hv">
        <section className="herox">
          <div className="wrap herogrid">
            <div className="hcopy">
              <p className="kicker"><Sparkles size={16} aria-hidden /> Exam prep for engineering students</p>
              <h1>Know what to study next. <em>Even the night before.</em></h1>
              <ul className="ticks">
                <li><Check size={20} strokeWidth={3} aria-hidden /> Notes, important questions, cheatsheets and quizzes for every unit</li>
                <li><Check size={20} strokeWidth={3} aria-hidden /> A study plan built around your exam dates</li>
                <li><Check size={20} strokeWidth={3} aria-hidden /> Written for your university syllabus, by the people who teach it</li>
              </ul>
              <div className="ctas">
                <Link className="big yellow" href="/courses">Get your courses</Link>
                <a className="big ghostw" href="#download">Get the app</a>
              </div>
              <p className="fine">Live now on Android, iOS, macOS and Windows</p>
            </div>
            <div className="hart">
              <div className="blob" aria-hidden />
              <img src="/home/hero_study.webp" alt="Three Paartha students surrounded by books and loose papers the night before an exam" width={747} height={1000} />
              <span className="hchip c1"><BookOpenCheck size={18} aria-hidden /> Exam tomorrow, 9 AM</span>
              <span className="hchip c2 ok"><Check size={18} strokeWidth={3} aria-hidden /> Important questions, ready</span>
            </div>
          </div>
          <div className="wrap duo">
            <div className="duocard dyellow">
              <h2>Get your courses</h2>
              <p>Pick your subjects and start revising today.</p>
              <Link className="big navy" href="/courses">Browse courses <ArrowRight size={18} aria-hidden /></Link>
            </div>
            <div className="duocard dred">
              <h2>Get the app on any device</h2>
              <p>Android, iOS, macOS and Windows.</p>
              <a className="big cream" href="#download">See downloads <ArrowRight size={18} aria-hidden /></a>
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden>
          <div className="track">{[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (<span key={i}>{t}<i>✦</i></span>))}</div>
        </div>

        <section className="wrap sec">
          <h2 className="h2">What do you need right now?</h2>
          <div className="needs">
            {needs.map(({ t, I, c }) => (
              <Link href="/courses" className={`need n-${c}`} key={t}><span>{t}</span><I size={34} strokeWidth={2} aria-hidden /><ArrowRight className="go" size={18} aria-hidden /></Link>
            ))}
          </div>
        </section>

        <section className="statband">
          <div className="wrap">
            <dl>
              <div><dt>19</dt><dd>courses to choose from</dd></div>
              <div><dt>5</dt><dd>units in every course</dd></div>
              <div><dt>5</dt><dd>kinds of study resource in every unit</dd></div>
              <div><dt>4</dt><dd>platforms: Android, iOS, macOS and Windows</dd></div>
            </dl>
          </div>
        </section>

        <section className="wrap sec">
          <h2 className="h2">Why students will love it</h2>
          <p className="sub">Built to cut the clutter and show only what matters for your exam.</p>
          <div className="why">
            {why.map((w, i) => (
              <div className={`wcard w${i % 4}`} key={w.t}>
                <div><h3>{w.t}</h3><p>{w.d}</p></div>
                <img src={`/home/${w.img}.webp`} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        <section className="yband">
          <div className="wrap">
            <h2 className="h2">See it in action</h2>
            <p className="sub">Real screens from the app.</p>
            <Strip images={[1, 2, 3, 4, 5, 6].map((n) => `/home/slide_${n}.webp`)} />
          </div>
        </section>

        <section className="wrap sec">
          <h2 className="h2">What is inside every unit</h2>
          <div className="inside">
            {inside.map(({ t, d, I }, i) => (
              <div className={`icard2 i${i % 3}`} key={t}><span className="ic"><I size={26} strokeWidth={2.2} aria-hidden /></span><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </section>

        <section className="nband">
          <div className="wrap">
            <h2 className="h2 w">Students are walking in ready</h2>
            <p className="sub w">Early users, from first year to final year.</p>
            <Testimonials />
          </div>
        </section>

        <section className="wrap sec twocol">
          <div>
            <h2 className="h2">Who makes the content</h2>
            <p className="sub">Every course is written around your university syllabus and prepared by the instructors who teach it, so what you revise matches what you are examined on.</p>
            <h2 className="h2" style={{ marginTop: 40 }}>Mudras: earn them by learning</h2>
            <p className="sub">Mudras are Paartha&apos;s reward points. Study effort that adds up earns them: a daily streak, finishing five resources in a day, a completed unit or course. They take money off courses. Some are promotional, some are earned. Terms apply.</p>
          </div>
          <img className="side" src="/home/char_5_breathe.webp" alt="" loading="lazy" />
        </section>

        <section className="wrap sec faqx">
          <h2 className="h2">Questions, answered</h2>
          <FaqList items={faq} />
          <p className="fine dk">More on the <Link href="/support">support page</Link>.</p>
        </section>

        <section className="dl" id="download">
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
