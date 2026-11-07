import { EDUCATORS, type Educator } from "@/content/educators";

const TONES = ["navy", "red", "yellow"] as const;

function Card({ e, i }: { e: Educator; i: number }) {
  return (
    <article className="educard">
      <div className={`eduav tone-${TONES[i % 3]}`}>
        {e.photo ? (
          <img src={e.photo} alt={e.name} loading="lazy" />
        ) : (
          <svg viewBox="0 0 64 64" aria-hidden><circle cx="32" cy="24" r="12" /><path d="M8 64c0-15 11-25 24-25s24 10 24 25z" /></svg>
        )}
      </div>
      <h3>{e.name}</h3>
      <span className="edubadge">{e.badge}</span>
      <ul>{e.courses.map((c) => (<li key={c}>{c}</li>))}</ul>
    </article>
  );
}

/** The people behind the courses, in two rows that drift in opposite directions (still for reduced motion). */
export default function Educators() {
  const half = Math.ceil(EDUCATORS.length / 2);
  const rows = [EDUCATORS.slice(0, half), EDUCATORS.slice(half)];
  return (
    <div className="edumarq">
      {rows.map((row, r) => (
        <div className={`edurow${r === 1 ? " rev" : ""}`} key={r}>
          <div className="edutrack">
            {row.map((e, i) => (<Card e={e} i={i + r * half} key={e.name} />))}
            {row.map((e, i) => (<div className="edudup" key={`d-${e.name}`} aria-hidden><Card e={e} i={i + r * half} /></div>))}
          </div>
        </div>
      ))}
    </div>
  );
}
