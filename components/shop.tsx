import type { Course } from "@/lib/student";

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null);
/** What the app's sheet shows as the description: the first sentence, up to " of both". */
export const blurb = (c: Course) => `${c.description.split(" of both")[0].replace(/\.$/, "")}.`;
export const availability = (iso: string | null) => (iso ? `Course available from ${day(iso)}` : "Course available soon");

/** The census chip: "455 members are taking this course". */
export function Members({ n }: { n?: number }) {
  if (!n) return null;
  return <span className="chip">{n.toLocaleString("en-IN")} members are taking this course</span>;
}
