import Link from "next/link";

const TONES = ["navy", "red", "yellow"] as const;
const MAX_COURSES = 2;

export type Person = { name: string; badge?: string; courses?: string[]; photo?: string };

/** One person card; the whole card links to their own page (/educators/<slug> or /sarathi/<slug>). */
export default function PersonCard({ p, i, href, hidden = false }: { p: Person; i: number; href: string; hidden?: boolean }) {
  const courses = p.courses ?? [];
  return (
    <Link href={href} className="educard" tabIndex={hidden ? -1 : undefined} aria-label={hidden ? undefined : p.name}>
      <div className={`eduav tone-${TONES[i % 3]}`}>
        {p.photo ? (
          <img src={p.photo} alt={hidden ? "" : p.name} loading="lazy" />
        ) : (
          <svg viewBox="0 0 64 64" aria-hidden><circle cx="32" cy="24" r="12" /><path d="M8 64c0-15 11-25 24-25s24 10 24 25z" /></svg>
        )}
      </div>
      <h3>{p.name}</h3>
      {p.badge && <span className="edubadge">{p.badge}</span>}
      {courses.length > 0 && (
        <ul>
          {courses.slice(0, MAX_COURSES).map((c, k) => (<li key={c} className={k > 0 ? "edu-c2" : undefined}>{c}</li>))}
          {courses.length > MAX_COURSES && <li className="edumore edu-pd" title={courses.slice(MAX_COURSES).join(", ")}>+{courses.length - MAX_COURSES}</li>}
          {courses.length > 1 && <li className="edumore edu-pm" title={courses.slice(1).join(", ")}>+{courses.length - 1}</li>}
        </ul>
      )}
    </Link>
  );
}
