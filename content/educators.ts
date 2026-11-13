/** The people who wrote and reviewed the courses. `photo` is a path under /public (empty until we have the real picture). */
export type Educator = { name: string; badge: string; courses: string[]; photo?: string };

/** URL slug for a person's own page, e.g. "Manas Malla" -> "manas-malla". */
export const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const EDUCATORS: Educator[] = [
  { name: "Manas Malla", badge: "Ex-GITAMite", courses: ["Object Oriented Programming", "Computer Organization & Architecture", "Computer Graphics & Multimedia", "Total Quality Management", "Pattern Recognition & ML"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/manas.webp" },
  { name: "Nithin Raghavendra", badge: "Ex-GITAMite", courses: ["Project Management"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/nithin.webp" },
  { name: "Praveena Gorle", badge: "Sophomore year", courses: ["Object Oriented Programming"] },
  { name: "Parasubotu Yashasvi", badge: "Sophomore year", courses: ["Probability & Statistics"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/yashasvi.webp" },
  { name: "Jhanshi Rani Gurugubelli", badge: "Sophomore year", courses: ["Data Structures"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/jhanshi.webp" },
  { name: "Satya Jahnavi Ashok Solanki", badge: "Junior year", courses: ["Computer Networks"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/jahnavi.webp" },
  { name: "Nekkanti Dharni", badge: "Junior year", courses: ["Machine Learning"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/dharni.webp" },
  { name: "Jaswanth Kumar Chettupalli", badge: "Junior year", courses: ["Machine Learning Techniques"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/jaswanth.webp" },
  { name: "Ikkara Rishi Karthikeyan", badge: "Junior year", courses: ["Artificial Intelligence"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/rishi.webp" },
  { name: "Pavan Kumar Cherukuri", badge: "Junior year", courses: ["Web Application Frameworks"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/pavan.webp" },
  { name: "M Sai Akhil Reddy", badge: "Junior year", courses: ["Software Engineering"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/akhil.webp" },
  { name: "Gagana Bandaru", badge: "Junior year", courses: ["Computer Graphics & Multimedia"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/gagana.webp" },
  { name: "Deva Harshini Mandali", badge: "Senior year", courses: ["Building Agentic AI Systems"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/deva.webp" },
  { name: "Mohan Tanuj Ponasanapalli", badge: "Senior year", courses: ["Adhoc and Sensor Networks"], photo: "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/educators/mohan.webp" },
  { name: "Avantika Manoj Nair", badge: "Sophomore year", courses: ["Computer Organization & Architecture"] },
];
