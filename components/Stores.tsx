"use client";

import { useEffect, useState } from "react";
import { MACOS_DMG_URL, PLAY_STORE_URL, TESTFLIGHT_URL, WINDOWS_EXE_URL } from "@/lib/stores";

type Os = "windows" | "macos" | "android" | "ios";

/** The download buttons, the one for this device first (the filled one): Windows, macOS, Android or iOS. */
export default function Stores({ light = false }: { light?: boolean }) {
  const [os, setOs] = useState<Os>("android");
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) setOs("android");
    else if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) setOs("ios");
    else if (/Mac OS|Macintosh/i.test(ua)) setOs("macos");
    else if (/Windows/i.test(ua)) setOs("windows");
  }, []);
  const cls = (first: boolean) => `btn${light ? " light" : ""}${first ? "" : " ghost"}`;
  const links: Record<Os, { label: string; href: string; download?: boolean }> = {
    windows: { label: "Download for Windows", href: WINDOWS_EXE_URL, download: true },
    macos: { label: "Download for macOS", href: MACOS_DMG_URL, download: true },
    android: { label: "Get it on Google Play", href: PLAY_STORE_URL },
    ios: { label: "Install on iOS**", href: TESTFLIGHT_URL },
  };
  const order: Os[] = [os, ...(["windows", "macos", "android", "ios"] as Os[]).filter((o) => o !== os)];
  return (
    <>
      <div className="stores">
        {order.map((o, i) => (
          <a key={o} className={cls(i === 0)} href={links[o].href} download={links[o].download || undefined}>{links[o].label}</a>
        ))}
      </div>
      <p className="storefoot">* The public App Store link is expected by 9 November.</p>
    </>
  );
}
