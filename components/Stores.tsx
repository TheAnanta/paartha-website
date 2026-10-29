"use client";

import { ANDROID_APK_URL } from "@/lib/stores";

/** The download buttons: the Android APK is live; iOS, macOS and Windows arrive on 1 November. */
export default function Stores({ light = false }: { light?: boolean }) {
  const cls = (ghost: boolean, soon = false) => `btn${light ? " light" : ""}${ghost ? " ghost" : ""}${soon ? " soon" : ""}`;
  return (
    <>
      <div className="stores">
        <a className={cls(false)} href={ANDROID_APK_URL} download>Download for Android (APK)*</a>
        <span className={cls(true, true)} aria-disabled="true">iOS · Coming soon</span>
        <span className={cls(true, true)} aria-disabled="true">macOS · Coming soon</span>
        <span className={cls(true, true)} aria-disabled="true">Windows · Coming soon</span>
      </div>
      <p className="storenote">iOS, macOS and Windows launch on 1 November.<br />* The Google Play version of the Android app also goes live on 1 November.</p>
    </>
  );
}
