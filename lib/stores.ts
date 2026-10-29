// Where the app lives in the stores. The environment variables override these (for a staging site, say).
export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "https://apps.apple.com/us/app/paartha-exam-prep-study/id6826900500";
export const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=dev.theananta.paartha";

// The Android APK, hosted on R2 until the Play Store listing goes live (1 November).
export const ANDROID_APK_URL = process.env.NEXT_PUBLIC_ANDROID_APK_URL || "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/binaries/Paartha%20-%20Exam%20Prep%20%26%20Study%20-%20Version%201.0.0%20(190204).apk";
