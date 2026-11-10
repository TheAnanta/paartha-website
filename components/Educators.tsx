import { EDUCATORS, slugify } from "@/content/educators";
import PersonCard from "./PersonCard";

/** The people behind the courses, in two rows that drift in opposite directions (still for reduced motion). */
export default function Educators() {
  const half = Math.ceil(EDUCATORS.length / 2);
  const rows = [EDUCATORS.slice(0, half), EDUCATORS.slice(half)];
  return (
    <div className="edumarq">
      {rows.map((row, r) => (
        <div className={`edurow${r === 1 ? " rev" : ""}`} key={r}>
          <div className="edutrack">
            {row.map((e, i) => (<PersonCard p={e} i={i + r * half} href={`/educators/${slugify(e.name)}`} key={e.name} />))}
            {row.map((e, i) => (<div className="edudup" key={`d-${e.name}`} aria-hidden><PersonCard p={e} i={i + r * half} href={`/educators/${slugify(e.name)}`} hidden /></div>))}
          </div>
        </div>
      ))}
    </div>
  );
}
