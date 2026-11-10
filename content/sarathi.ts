import { slugify } from "./educators";

/** The team behind Paartha. `photo` is a path under /public (empty until we have the picture). */
export type TeamMember = { name: string; badge: string; photo?: string };

export const SARATHI: TeamMember[] = [
  { name: "Manas Malla", badge: "Developer", photo: "/educators/manas.webp" },
  { name: "Gagana Bandaru", badge: "UX & Product Manager", photo: "/educators/gagana.webp" },
  { name: "Deva Harshini Mandali", badge: "Founding team", photo: "/educators/deva.webp" },
  { name: "Kaarthikeyani", badge: "AI engineer", photo: "/educators/kaarthikeyani.webp" },
  { name: "Hema Sree", badge: "AI engineer", photo: "/educators/hema.webp" },
  { name: "Satwika Rejeti", badge: "Marketing lead & operations", photo: "/educators/satwika.webp" },
  { name: "Chaitanya Sameer Chalasani", badge: "Content review & finances", photo: "/educators/chaitanya.webp" },
  { name: "Raja Reddy Maram", badge: "Operations intern" },
];

export { slugify };
