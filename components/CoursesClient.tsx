"use client";

import { signOut, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import StudentGate from "@/components/StudentGate";
import { auth } from "@/lib/firebase";
import { addToCart, type Course, getCart, getCensus, listCourses, PLAN } from "@/lib/student";
import { availability, blurb, CourseImage, day, Desc, inr, Members } from "@/components/shop";

export default function CoursesClient() {
  return <StudentGate>{(user) => <Courses user={user} />}</StudentGate>;
}

function Courses({ user }: { user: User }) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [census, setCensus] = useState<Record<string, number>>({});
  const [inCart, setInCart] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = await user.getIdToken();
        const [cs, ct, cn] = await Promise.all([listCourses(token), getCart(token), getCensus(token).catch(() => ({}))]);
        setCourses(cs);
        setCart(ct.items.map((i) => i.id));
        setCensus(cn);
      } catch (e) {
        setError(e instanceof Error ? e.message : "We couldn't load your courses.");
      }
    })();
  }, [user]);
  const setCart = (ids: string[]) => setInCart(new Set(ids));

  // "Buy now" puts the course in the cart and takes the student there to pay.
  async function buyNow(id: string) {
    setError("");
    setBusy(id);
    try {
      if (!inCart.has(id)) await addToCart(await user.getIdToken(), id);
      router.push("/cart");
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't add that course.");
      setBusy(null);
    }
  }

  const open = courses.filter((c) => !c.purchased);
  const mine = courses.filter((c) => c.purchased);
  const grouped = useMemo(() => {
    const m = new Map<string, Course[]>();
    for (const c of courses.filter((x) => !x.purchased)) m.set(c.category, [...(m.get(c.category) ?? []), c]);
    return [...m.entries()];
  }, [courses]);
  const availableOn = day((open[0] ?? mine[0])?.available_from ?? null);

  return (
    <>
      <div className="acct-hero" style={{ marginTop: 24 }}>
        <div>
          <h1 style={{ fontSize: 40, letterSpacing: -1, margin: 0 }}>Pre-register your battle plan</h1>
          <p className="muted" style={{ margin: 0 }}>Hi {user.displayName?.split(" ")[0] ?? "there"}, these are your courses.</p>
        </div>
        <a className="acct-link" href="/cart">Your cart</a>
        <button className="acct-link" style={{ marginLeft: 12 }} onClick={() => signOut(auth)}>Sign out</button>
      </div>

      <section className="acct-card prereg">
        <p className="label">{PLAN.name} · {PLAN.tag}</p>
        <h2>What you get when you pre-register</h2>
        <p className="muted">{availableOn ? `Course content opens on ${availableOn}.` : "Course content opens soon."} Pay now at the pre-registration price; every unit stays locked until then, and you&rsquo;ll be notified in the app when your course opens.</p>
        <ul className="feat">{PLAN.features.map((f) => (<li key={f}>{f}</li>))}</ul>
        <p className="muted small">Mudras are applied to your order automatically (10 mudras = ₹1): promotional mudras cover up to 250 mudras (₹25) of each course, and mudras you earned by effort can cover more. Prices include GST.</p>
      </section>

      {error && <p className="acct-msg bad">{error}</p>}
      {grouped.length === 0 && <p className="muted">No courses are open for pre-registration right now.</p>}
      {grouped.map(([category, list]) => (
        <section key={category}>
          <h2 className="section" style={{ marginTop: 28 }}>{category}</h2>
          <div className="clist">
            {list.map((c) => (
              <article className="ccard" key={c.id}>
                <CourseImage c={c} />
                <div className="ctop"><span className="tag">{c.code}</span><span className="tag out">{PLAN.tag}</span></div>
                <h3>{c.title}</h3>
                <Desc text={blurb(c)} />
                <Members n={census[c.id]} />
                <p className="avail">{availability(c.available_from)}</p>
                <div className="cbuy">
                  <div className="price"><b>{inr(c.price)}</b>{c.regular_price > c.price && <s>{inr(c.regular_price)}</s>}</div>
                  <button className="pill" disabled={busy !== null} onClick={() => buyNow(c.id)}>{busy === c.id ? "Opening cart…" : "Buy now"}</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
      {mine.length > 0 && (
        <section>
          <h2 className="section" style={{ marginTop: 28 }}>Already yours</h2>
          <div className="clist">
            {mine.map((c) => (
              <article className="ccard done" key={c.id}>
                <div className="ctop"><span className="tag">{c.code}</span></div>
                <h3>{c.title}</h3>
                <p className="avail">{c.pre_registration ? `You’re pre-registered. ${availability(c.available_from)}` : "You own this course. Open it in the app."}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
