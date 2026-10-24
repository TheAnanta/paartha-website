"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// The public identifiers of Paartha's Firebase web app (they are not secrets); override them with NEXT_PUBLIC_FIREBASE_* if needed.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC5sTUEZSEvRdMaVm9JuxsXDWhR0-E1fjA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "paartha.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "paartha",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1088270011688:web:83b737496c2dd5882d541d",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(config);
export const auth = getAuth(firebaseApp);
