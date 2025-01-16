import * as firebase from "firebase/app";
import * as firebaseAuth from "firebase/auth";

const firebaseConfig = {
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: "me-sbg-list-builder",
  authDomain: "me-sbg-list-builder.firebaseapp.com",
  storageBucket: "me-sbg-list-builder.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
};

export const app = firebase.initializeApp(firebaseConfig);
export const auth = firebaseAuth.getAuth(app);

auth
  .setPersistence(firebaseAuth.browserLocalPersistence)
  .then(() => console.debug("Auth Persistence set to LocalStorage..."))
  .catch((e) => console.error("Could not set Auth Persistence", e));
