import { UserCredential } from "@firebase/auth";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config.ts";

export type FirebaseAuthFunctions = {
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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

  const resetPassword = async (email: string) =>
    await sendPasswordResetEmail(auth, email);

  const signIn = async (email: string, password: string) =>
    await signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = async () =>
    await signInWithPopup(auth, new GoogleAuthProvider());

  const signOutWrapper = async () => {
    await signOut(auth);
  };

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut: signOutWrapper,
    resetPassword,
  };
};
