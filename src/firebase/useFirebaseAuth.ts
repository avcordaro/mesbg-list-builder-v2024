import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config.ts";

export type FirebaseAuthFunctions = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
};

export const useFirebaseAuth: () => FirebaseAuthFunctions = () => {
  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    await createUserWithEmailAndPassword(auth, email, password).then(
      ({ user }) => updateProfile(user, { displayName }),
    );
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOutWrapper = async () => {
    await signOut(auth);
  };

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut: signOutWrapper,
  };
};
