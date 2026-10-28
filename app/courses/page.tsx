import CoursesClient from "@/components/CoursesClient";
import { Footer, Header } from "@/components/Chrome";

export const metadata = { title: "Pre-register for your courses" };

export default function Courses() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 980 }}>
        <CoursesClient />
      </main>
      <Footer />
    </>
  );
}
