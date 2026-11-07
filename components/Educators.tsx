import { EDUCATORS } from "@/content/educators";

const TONES = ["navy", "red", "yellow"] as const;

/** The people behind the courses: a photo (a placeholder until we have it), name, badge and what they wrote. */
export default function Educators() {
  return (
    <div className="edugrid">
      {EDUCATORS.map((e, i) => (
        <article className="educard" key={e.name}>
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
      ))}
    </div>
  );
}
