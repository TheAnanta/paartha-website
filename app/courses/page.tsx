import CoursesClient from "@/components/CoursesClient";
import { Footer, Header } from "@/components/Chrome";

export const metadata = { title: "Your courses", robots: { index: false, follow: false } };

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
