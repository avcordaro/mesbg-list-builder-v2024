import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

const firebaseConfig = {
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: "me-sbg-list-builder",
  authDomain: "me-sbg-list-builder.firebaseapp.com",
  storageBucket: "me-sbg-list-builder.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
};

function validateEnvironmentVariables() {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length >= 1) {
    console.warn(
      `Firebase configuration is incomplete! Missing keys: ${missingKeys}.`,
    );
    return false;
  }
  return true;
}

let app: FirebaseApp;
let auth: Auth;

if (validateEnvironmentVariables()) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .then(() => console.debug("Auth Persistence set to LocalStorage..."))
    .catch((e) => console.error("Could not set Auth Persistence", e));
}

export { app, auth };
