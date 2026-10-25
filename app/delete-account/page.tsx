import { Footer, Header, SUPPORT_EMAIL } from "@/components/Chrome";

export const metadata = {
  title: "Delete your Paartha account and data",
  description: "How to delete your Paartha account and the data linked to it, what is deleted and what is kept.",
};

const MAIL = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Delete my Paartha account")}`;

export default function DeleteAccount() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ maxWidth: 760 }}>
        <h1 style={{ fontSize: 40, letterSpacing: -1 }}>Delete your Paartha account and data</h1>
        <p style={{ color: "var(--muted)" }}>
          This page is for the <strong>Paartha</strong> app (by <strong>the ananta</strong>, <code>dev.theananta.paartha</code> on Google Play and the App Store). You can delete your whole account, or only some of your data, yourself, or ask us to do it.
        </p>

        <h2 className="section" style={{ fontSize: 24 }}>Option 1: delete it in the app (instant)</h2>
        <ol>
          <li>Open Paartha and sign in.</li>
          <li>Tap the profile icon at the top right, then <strong>My Data</strong>.</li>
          <li>To delete your <strong>whole account</strong>, tap <strong>Delete my account</strong>, type <strong>DELETE</strong> to confirm and tap Delete. You are signed out and the account is removed straight away.</li>
          <li>To delete <strong>only some data</strong>, tick the groups you want gone (study activity, reviews, support conversations, notifications, cart) and tap <strong>Delete selected</strong>. Your account stays.</li>
        </ol>

        <h2 className="section" style={{ fontSize: 24 }}>Option 2: ask us to delete it (no app needed)</h2>
        <p>If you can&rsquo;t open the app, for example you uninstalled it or lost your phone, email us:</p>
        <ol>
          <li>Write from the email address you sign in to Paartha with, to <a href={MAIL}>{SUPPORT_EMAIL}</a>, with the subject <strong>Delete my Paartha account</strong>.</li>
          <li>Include your name and your university roll number so we can find the account.</li>
          <li>We reply to confirm it&rsquo;s you and delete the account and the data below within <strong>30 days</strong>, and tell you when it&rsquo;s done.</li>
        </ol>

        <h2 className="section" style={{ fontSize: 24 }}>What is deleted</h2>
        <p>When your account is deleted, we permanently remove:</p>
        <ul>
          <li>Your profile: name, username, email address, roll number, semester, profile picture and device identifier.</li>
          <li>Your study activity, progress, streaks, quiz attempts and bookmarks.</li>
          <li>Your mudra balance and mudra history.</li>
          <li>Your reviews, support conversations and the images in them, notifications, cart and applied coupon.</li>
          <li>Your enrolments and course purchases, and the payment records linked to your account (they are removed with the account).</li>
          <li>Your push notification token.</li>
        </ul>
        <p><strong>Deleting is permanent.</strong> Courses you paid for are not refunded and cannot be restored, and unspent mudras are lost. To get access again you would create a new account.</p>

        <h2 className="section" style={{ fontSize: 24 }}>What we keep, and for how long</h2>
        <ul>
          <li><strong>Backups:</strong> deleted data can remain in routine backups for a short period before it is overwritten.</li>
          <li><strong>Payment provider:</strong> Razorpay, which processes card and UPI payments, keeps its own records of payments under its own legal obligations and privacy policy. We don&rsquo;t control those.</li>
          <li><strong>Sign-in provider:</strong> the Google or Apple account you signed in with is yours and is not deleted. Paartha only loses the link to it.</li>
          <li>Anything we are required by law to keep (for example, tax records of a payment) stays for as long as that law says.</li>
        </ul>
        <p>You can read how we handle data in our <a href="/privacy">Privacy Policy</a>. Questions? Write to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      </main>
      <Footer />
    </>
  );
}
