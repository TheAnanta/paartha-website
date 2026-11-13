import { slugify } from "./educators";

/** The team behind Paartha. `photo` is a path under /public (empty until we have the picture). */
export type TeamMember = { name: string; badge: string; photo?: string };

export const SARATHI: TeamMember[] = [
  { name: "Manas Malla", badge: "Software Developer", photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/manas.webp" },
  { name: "Gagana Bandaru", badge: "UX Designer & Product Manager", photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/gagana.webp" },
  { name: "Deva Harshini Mandali", badge: "Founding Team Member", photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/deva.webp" },
  { name: "Kaarthikeyani", badge: "AI Engineer", photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/kaarthikeyani.webp" },
  { name: "Hema Sree", badge: "AI Engineer", photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/hema.webp" },
  { name: "Satwika Rejeti", badge: "Marketing & Operations Lead", photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/satwika.webp" },
  { name: "Chaitanya Sameer Chalasani", badge: "Content Review & Finance", photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/chaitanya.webp" },
  { name: "Raja Reddy Maram", badge: "Operations Intern" },
];

export { slugify };
