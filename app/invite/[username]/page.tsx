import { Footer, Header } from "@/components/Chrome";
import { InviteButtons } from "@/components/InviteClient";

// A username is 3 to 24 lower-case letters, digits or underscores; anything else is shown as a plain invitation.
const VALID = /^[a-z0-9_]{3,24}$/;

export const metadata = { title: "You're invited to Paartha", robots: { index: false } };

export default async function Invite({ params }: { params: Promise<{ username: string }> }) {
  const raw = decodeURIComponent((await params).username).toLowerCase();
  const username = VALID.test(raw) ? raw : "";
  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 640 }}>
        <h1 style={{ fontSize: 40, letterSpacing: -1 }}>{username ? `@${username} invited you to Paartha` : "You're invited to Paartha"}</h1>
        <p style={{ color: "var(--muted)" }}>
          Notes, important questions, flashcards, mind maps and quizzes for every unit, so you always know what to study next, even the night before an exam.
        </p>
        {username ? (
          <>
            <p>Download the app and sign up. Your friend&rsquo;s username <strong>@{username}</strong> is filled in for you, and they earn mudras when you join.</p>
            <InviteButtons username={username} />
          </>
        ) : (
          <InviteButtons username="" />
        )}
      </main>
      <Footer />
    </>
  );
}
