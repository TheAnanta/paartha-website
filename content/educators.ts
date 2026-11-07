/** The people who wrote and reviewed the courses. `photo` is a path under /public (empty until we have the real picture). */
export type Educator = { name: string; badge: string; courses: string[]; photo?: string };

export const EDUCATORS: Educator[] = [
  { name: "Manas Malla", badge: "Ex-GITAMite", courses: ["Object Oriented Programming", "Computer Organization & Architecture", "Computer Graphics & Multimedia", "Total Quality Management", "Pattern Recognition & ML"], photo: "/educators/manas.webp" },
  { name: "Nithin Raghavendra", badge: "Ex-GITAMite", courses: ["Project Management"], photo: "/educators/nithin.webp" },
  { name: "Praveena Gorle", badge: "Sophomore", courses: ["Object Oriented Programming"] },
  { name: "Parasubotu Yashasvi", badge: "Sophomore", courses: ["Probability & Statistics"], photo: "/educators/yashasvi.webp" },
  { name: "Jhanshi Rani Gurugubelli", badge: "Sophomore", courses: ["Data Structures"], photo: "/educators/jhanshi.webp" },
  { name: "Satya Jahnavi Ashok Solanki", badge: "Junior", courses: ["Computer Networks"] },
  { name: "Nekkanti Dharni", badge: "Junior", courses: ["Machine Learning"] },
  { name: "Jaswanth Kumar Chettupalli", badge: "Junior", courses: ["Machine Learning Techniques"], photo: "/educators/jaswanth.webp" },
  { name: "Ikkara Rishi Karthikeyan", badge: "Junior", courses: ["Artificial Intelligence"] },
  { name: "Pavan Kumar Cherukuri", badge: "Junior", courses: ["Web Application Frameworks"], photo: "/educators/pavan.webp" },
  { name: "M Sai Akhil Reddy", badge: "Junior", courses: ["Software Engineering"] },
  { name: "Gagana Bandaru", badge: "Junior", courses: ["Computer Graphics & Multimedia"], photo: "/educators/gagana.webp" },
  { name: "Deva Harshini Mandali", badge: "Senior", courses: ["Building Agentic AI Systems"], photo: "/educators/deva.webp" },
  { name: "Mohan Tanuj Ponasanapalli", badge: "Senior", courses: ["Adhoc and Sensor Networks"], photo: "/educators/mohan.webp" },
];
