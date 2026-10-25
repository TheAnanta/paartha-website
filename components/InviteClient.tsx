"use client";

const APP_STORE = process.env.NEXT_PUBLIC_APP_STORE_URL;
const PLAY_STORE = process.env.NEXT_PUBLIC_PLAY_STORE_URL;

/**
 * The store buttons on an invitation. Pressing one first copies `paartha-invite:<username>` to the clipboard; the app reads it
 * back the first time its sign-up form opens, so the friend's username is already filled in and the inviter is credited.
 */
export function InviteButtons({ username }: { username: string }) {
  const copy = async () => {
    try {
      if (username) await navigator.clipboard.writeText(`paartha-invite:${username}`);
    } catch {
      /* no clipboard access: the friend can still type the username in the app */
    }
  };
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
      {APP_STORE && <a className="btn" href={APP_STORE} onClick={copy}>Download on the App Store</a>}
      {PLAY_STORE && <a className="btn ghost" href={PLAY_STORE} onClick={copy}>Get it on Google Play</a>}
      {!APP_STORE && !PLAY_STORE && <button className="btn" onClick={copy}>Copy my invitation</button>}
    </div>
  );
}
