"use client";

import { ANDROID_APK_URL, TESTFLIGHT_URL, MACOS_DMG_URL } from "@/lib/stores";

/** The download buttons: Android, iOS (TestFlight) and macOS are live; Windows is coming soon. */
export default function Stores({ light = false }: { light?: boolean }) {
  const cls = (ghost: boolean, soon = false) => `btn${light ? " light" : ""}${ghost ? " ghost" : ""}${soon ? " soon" : ""}`;
  return (
    <>
      <div className="stores">
        <a className={cls(false)} href={ANDROID_APK_URL} download>Download for Android (APK)*</a>
        <a className={cls(false)} href={TESTFLIGHT_URL}>Install on iOS (TestFlight)**</a>
        <a className={cls(false)} href={MACOS_DMG_URL} download>Download for macOS (DMG)</a>
        <span className={cls(true, true)} aria-disabled="true">Windows · Coming soon</span>
      </div>
      <p className="storenote">Windows launches on 1 November.</p>
      <p className="storefoot">* The Google Play version of the Android app also goes live on 1 November.<br />** The public App Store link will be available after 1 November.</p>
    </>
  );
}
