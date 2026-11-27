import Stores from "@/components/Stores";

/** Where a signed-in student opens what they paid for: the app, with this device's download first. */
export default function GetApp() {
  return (
    <section className="acct-card getapp">
      <div className="getapp-text">
        <h2>Access your paid content in the app</h2>
        <p className="muted">Everything in the courses you buy opens in the Paartha app: notes, important questions, flashcards and quizzes. Download it and sign in with the same account you use here.</p>
        <Stores />
      </div>
      <img className="getapp-art" src="/home/exam_writing.webp" alt="" width={767} height={1195} />
    </section>
  );
}
