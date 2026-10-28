"use client";

import { useEffect, useState } from "react";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/stores";

/** The two store buttons: the first (filled) is the one for this device, the App Store on Apple devices and Safari, the Play Store otherwise. */
export default function Stores({ light = false }: { light?: boolean }) {
  const [apple, setApple] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    const android = /Android/i.test(ua);
    const safari = /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Android/i.test(ua);
    setApple(!android && (/iPhone|iPad|iPod|Macintosh|Mac OS/i.test(ua) || safari));
  }, []);
  const appStore = <a key="a" className={light ? `btn light${apple ? "" : " ghost"}` : `btn${apple ? "" : " ghost"}`} href={APP_STORE_URL}>Download on the App Store</a>;
  const play = <a key="p" className={light ? `btn light${apple ? " ghost" : ""}` : `btn${apple ? " ghost" : ""}`} href={PLAY_STORE_URL}>Get it on Google Play</a>;
  return <div className="stores">{apple ? [appStore, play] : [play, appStore]}</div>;
}
