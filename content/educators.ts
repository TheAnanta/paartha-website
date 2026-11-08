/** The people who wrote and reviewed the courses. `photo` is a path under /public (empty until we have the real picture). */
export type Educator = { name: string; badge: string; courses: string[]; photo?: string };

export const EDUCATORS: Educator[] = [
  { name: "Manas Malla", badge: "Ex-GITAMite", courses: ["Object Oriented Programming", "Computer Organization & Architecture", "Computer Graphics & Multimedia", "Total Quality Management", "Pattern Recognition & ML"], photo: "/educators/manas.webp" },
  { name: "Nithin Raghavendra", badge: "Ex-GITAMite", courses: ["Project Management"], photo: "/educators/nithin.webp" },
  { name: "Praveena Gorle", badge: "Sophomore year", courses: ["Object Oriented Programming"] },
  { name: "Parasubotu Yashasvi", badge: "Sophomore year", courses: ["Probability & Statistics"], photo: "/educators/yashasvi.webp" },
  { name: "Jhanshi Rani Gurugubelli", badge: "Sophomore year", courses: ["Data Structures"], photo: "/educators/jhanshi.webp" },
  { name: "Satya Jahnavi Ashok Solanki", badge: "Junior year", courses: ["Computer Networks"] },
  { name: "Nekkanti Dharni", badge: "Junior year", courses: ["Machine Learning"], photo: "/educators/dharni.webp" },
  { name: "Jaswanth Kumar Chettupalli", badge: "Junior year", courses: ["Machine Learning Techniques"], photo: "/educators/jaswanth.webp" },
  { name: "Ikkara Rishi Karthikeyan", badge: "Junior year", courses: ["Artificial Intelligence"] },
  { name: "Pavan Kumar Cherukuri", badge: "Junior year", courses: ["Web Application Frameworks"], photo: "/educators/pavan.webp" },
  { name: "M Sai Akhil Reddy", badge: "Junior year", courses: ["Software Engineering"], photo: "/educators/akhil.webp" },
  { name: "Gagana Bandaru", badge: "Junior year", courses: ["Computer Graphics & Multimedia"], photo: "/educators/gagana.webp" },
  { name: "Deva Harshini Mandali", badge: "Senior year", courses: ["Building Agentic AI Systems"], photo: "/educators/deva.webp" },
  { name: "Mohan Tanuj Ponasanapalli", badge: "Senior year", courses: ["Adhoc and Sensor Networks"], photo: "/educators/mohan.webp" },
];
