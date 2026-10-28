import Link from "next/link";

export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "paartha@theananta.in";

export function Header({ cta = true }: { cta?: boolean }) {
  return (
    <header className="site wrap">
      <Link href="/" className="brand">PAARTHA</Link>
      <nav>
        <Link href="/support">Support</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/account">Account</Link>
        {cta && <Link href="/courses" className="navcta">Pre-register</Link>}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site wrap">
      <div>© {new Date().getFullYear()} Paartha</div>
      <div>
        <Link href="/support">Support</Link>
        <Link href="/terms">Terms &amp; Conditions</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/delete-account">Delete account</Link>
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </div>
    </footer>
  );
}
