export type Testimonial = { title: string; quote: string; name: string; branch: string; year: 1 | 2 | 3 | 4 };

/** Early adopters, by year of study. */
export const TESTIMONIALS: Testimonial[] = [
  { year: 1, title: "Physics derivation crash course saved my sessional", quote: "Got barely 4 marks in S1 internal quizzes and was terrified of failing PHYS1291. The step-by-step numerical derivations on Paartha cut straight through the fluff. Jumped to 24 in S2. Genuinely life-saving.", name: "Rohit K.", branch: "CSE" },
  { year: 1, title: "DMS proofs actually made sense for once", quote: "Discrete Math recurrence relations and Hasse diagrams felt impossible from standard slides. Paartha’s solved question bank had the exact format asked in the papers. Prepared everything in two nights.", name: "Ananya V.", branch: "CSBS" },
  { year: 1, title: "FEEE formulas without the headache", quote: "Electrical and electronics was giving me nightmares. The concise cheat sheets for circuit analysis and AC fundamentals on Paartha saved me from a first-year backlog. Best ₹125 I've spent this semester.", name: "Siddharth M.", branch: "ECE" },
  { year: 1, title: "Chemistry cycle done and dusted", quote: "Spectroscopy and polymer chemistry seemed endless. Paartha condensed 5 bulky units into high-yield exam points. Walked out of the exam hall feeling confident.", name: "Bhavana P.", branch: "CSE" },
  { year: 2, title: "Surviving the Nov 11 double exam", quote: "Having P&S in the morning and COA in the afternoon on the exact same day felt like academic torture. I only used Paartha’s summary cards between 11:30 AM and 2:00 PM to refresh cache mapping and Booth’s algorithm. Cleared both comfortably.", name: "Naveen R.", branch: "CSE" },
  { year: 2, title: "Data Structures without the panic", quote: "When 400+ people failed S1 in DS, everyone panicked. The AVL rotations and graph traversal breakdowns on Paartha are 100x better than reading whole textbooks. Secured an A grade.", name: "Varun Teja", branch: "CSE-AI/ML" },
  { year: 2, title: "OOP Java concepts simplified", quote: "Was struggling with abstract interfaces and multi-threading corner cases in 24CSEN1011. The concise code walkthroughs and previous paper predictions hit right on target.", name: "Keerthi S.", branch: "IT" },
  { year: 2, title: "Probability & Stats formulas at your fingertips", quote: "Hypothesis testing (t-test, chi-square) always confused me in class. Paartha's step-by-step solved templates made it effortless to write the steps properly for full internal marks.", name: "Aditya G.", branch: "CSE" },
  { year: 2, title: "Network Theory for ECE made doable", quote: "Almost half our branch failed S1 Network Theory (24EECE1001). Paartha’s nodal analysis and Laplace transform modules literally kept me afloat.", name: "Karthik B.", branch: "ECE" },
  { year: 2, title: "Biotech process calculations solved cleanly", quote: "Process Calculations has one of the highest failure rates in bioengineering. Having actual worked-out mass balance numericals tailored to our syllabus was a total game-changer.", name: "Meghana D.", branch: "Biotechnology" },
  { year: 3, title: "Computer Networks subnetting unlocked", quote: "Subnetting CIDR math and TCP sliding window calculations used to take me hours. Paartha explained the exact pattern in 15 minutes. Scored 27/30 in Sessional 2.", name: "Sai Charan", branch: "CSE" },
  { year: 3, title: "TOC was terrifying until I found this", quote: "TOC on the same afternoon as Software Engineering was brutal. PDA construction and Turing machine state transitions were explained so cleanly on Paartha. Didn't leave a single question blank.", name: "Harshita N.", branch: "CSE" },
  { year: 3, title: "Machine Learning derivations without confusion", quote: "Backpropagation gradient updates and SVM dual formulation derivations are usually messy in college PPTs. Paartha breaks down the math step-by-step. Perfect for quick last-minute cramming.", name: "Tanmay S.", branch: "CSE-Data Science" },
  { year: 3, title: "Clutched Software Engineering in one evening", quote: "Needed a quick recap of Agile, Design Patterns, and testing metrics before the afternoon exam. The modular high-yield notes let me finish the entire syllabus before lunch.", name: "Sneha R.", branch: "IT" },
  { year: 3, title: "Computer Graphics algorithms clicked instantly", quote: "Bresenham’s line drawing and 3D transformation matrices were giving me anxiety. Paartha's visual diagrams and previous year solutions saved my grade.", name: "Praneeth V.", branch: "CSE" },
  { year: 3, title: "Web Frameworks concepts organized properly", quote: "Backend routing, middleware cycles, and authentication flow questions were spot on from the Paartha prep pack. Super clean presentation.", name: "Deepak Ch.", branch: "CSE" },
  { year: 4, title: "Agentic AI prep amidst placement season", quote: "Juggling company interview rounds while preparing for 24CSEN4121 was chaotic. Paartha gave me exactly what I needed to pass and score without wasting 20 hours reading research papers.", name: "Venkatesh K.", branch: "CSE" },
  { year: 4, title: "Pattern Recognition math simplified", quote: "Pattern Recognition & ML has a brutal fail rate among final-year electives. The Bayes decision theory and PCA step-by-step guides on Paartha were unmatched.", name: "Akhil T.", branch: "CSE" },
  { year: 4, title: "Adhoc Sensor Networks last-minute rescue", quote: "Routing protocols like DSR and AODV are easy to mix up. Paartha's comparison tables and architecture diagrams made answering the 10-mark questions effortless.", name: "Sravani L.", branch: "ECE" },
  { year: 4, title: "The ultimate campus study companion", quote: "I’ve tried randomly searching YouTube and reading 60-slide faculty PPTs for 4 years. Having a platform built specifically around our exam pattern and timetable is what engineering students actually needed.", name: "Manoj Kumar", branch: "CSE" },
];

export const YEARS = [
  { y: 0, label: "All" },
  { y: 1, label: "1st year" },
  { y: 2, label: "2nd year" },
  { y: 3, label: "3rd year" },
  { y: 4, label: "Final year" },
] as const;
