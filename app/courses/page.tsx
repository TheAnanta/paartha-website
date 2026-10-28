import CoursesClient from "@/components/CoursesClient";
import { Footer, Header } from "@/components/Chrome";

export const metadata = { title: "Pre-register for your courses" };

export default function Courses() {
  return (
    <>
      <Header cta={false} />
      <main className="wrap">
        <CoursesClient />
      </main>
      <Footer />
    </>
  );
}
