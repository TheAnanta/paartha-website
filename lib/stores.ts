// Where the app lives in the stores. The environment variables override these (for a staging site, say).
export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "https://apps.apple.com/us/app/paartha-exam-prep-study/id6826900500";
export const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=dev.theananta.paartha";

// The Android APK, hosted on R2 until the Play Store listing goes live (expected by 9 November).
export const ANDROID_APK_URL = process.env.NEXT_PUBLIC_ANDROID_APK_URL || "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/binaries/Paartha%20-%20Exam%20Prep%20%26%20Study%20-%20Version%201.0.0%20(190208).apk";

// The macOS installer, hosted on R2.
export const MACOS_DMG_URL = process.env.NEXT_PUBLIC_MACOS_DMG_URL || "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/binaries/Paartha%20-%20Exam%20Prep%20%26%20Study%20-%20Version%201.0.0%20(10140710).dmg";

// The Windows installer, hosted on R2.
export const WINDOWS_EXE_URL = process.env.NEXT_PUBLIC_WINDOWS_EXE_URL || "https://pub-289abb1a16f648c982cfeef6252aa000.r2.dev/binaries/Paartha%20-%20Exam%20Prep%20%26%20Study%20-%20Version%201.0.0%20(10190208)%20-%20Setup.exe";
