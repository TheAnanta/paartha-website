import { Check } from "lucide-react";

/** The sign-in and account-gate screens: an illustrated navy panel beside the form. */
export default function AuthShell({ art, kicker, title, points = [], children }: { art: string; kicker: string; title: string; points?: string[]; children: React.ReactNode }) {
  return (
    <div className="authshell">
      <aside className="authart">
        <p className="akicker">{kicker}</p>
        <h2 className="atitle">{title}</h2>
        {points.length > 0 && (
          <ul>{points.map((p) => (<li key={p}><Check size={18} strokeWidth={3} aria-hidden />{p}</li>))}</ul>
        )}
        <div className="ablob" aria-hidden />
        <img src={`/home/${art}.webp`} alt="" />
      </aside>
      <div className="authform">{children}</div>
    </div>
  );
}
