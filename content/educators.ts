/** The people who wrote and reviewed the courses. `photo` is a path under /public (empty until we have the real picture). */
export type Educator = { name: string; badge: string; courses: string[]; photo?: string };

export const EDUCATORS: Educator[] = [
  { name: "Manas Malla", badge: "Ex-GITAMite", courses: ["Object Oriented Programming", "Computer Organization & Architecture", "Computer Graphics & Multimedia", "Total Quality Management", "Pattern Recognition & ML"] },
  { name: "Nithin Raghavendra", badge: "Ex-GITAMite", courses: ["Project Management"] },
  { name: "Praveena Gorle", badge: "2-2", courses: ["Object Oriented Programming"] },
  { name: "Parasubotu Yashasvi", badge: "2-2", courses: ["Probability & Statistics"] },
  { name: "Jhanshi Rani", badge: "2-2", courses: ["Data Structures"] },
  { name: "Satya Jahnavi Ashok Solanki", badge: "3-3", courses: ["Computer Networks"] },
  { name: "Nekkanti Dharni", badge: "3-3", courses: ["Machine Learning"] },
  { name: "Jaswanth Kumar Chettupalli", badge: "3-3", courses: ["Machine Learning Techniques"] },
  { name: "Ikkara Rishi Karthikeyan", badge: "3-3", courses: ["Artificial Intelligence"] },
  { name: "Pavan Kumar Cherukuri", badge: "3-3", courses: ["Web Application Frameworks"] },
  { name: "M Sai Akhil Reddy", badge: "3-3", courses: ["Software Engineering"] },
  { name: "Gagana Bandaru", badge: "3-3", courses: ["Computer Graphics & Multimedia"] },
  { name: "Deva Harshini Mandali", badge: "4-4", courses: ["Building Agentic AI Systems"] },
  { name: "Mohan Tanuj Ponasanapalli", badge: "4-4", courses: ["Adhoc and Sensor Networks"] },
];
