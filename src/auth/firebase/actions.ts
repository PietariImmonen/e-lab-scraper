import { auth, firestore } from "@/config/firebase";

import {
  signOut as _signOut,
  signInWithPopup as _signInWithPopup,
  GoogleAuthProvider as _GoogleAuthProvider,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

interface SignInParams {
  email: string;
  password: string;
}

export type SignUpParams = {
  email: string;
  password: string;
};

export type ForgotPasswordParams = {
  email: string;
};

/**
 * Function for checking if the user already is created to the DB
 * @param email Email of the user
 * @returns
 */
const checkIfUserExists = async (email: string) => {
  if (email.length > 0) {
    const usersCollection = collection(firestore, "users");
    const q = query(usersCollection, where("email", "==", email));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return true;
    }
    return false;
  }
  return true;
};

import { doc, setDoc } from "firebase/firestore";

export const createUserInFirestore = async (
  userId: string,
  userData: {
    email: string;
    displayName?: string;
    photoURL?: string;
  },
): Promise<void> => {
  try {
    const userRef = doc(firestore, "users", userId);
    await setDoc(userRef, {
      email: userData.email,
      displayName: userData.displayName || null,
      photoURL: userData.photoURL || null,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user in Firestore:", error);
    throw error;
  }
};

export const signInWithPassword = async ({
  email,
  password,
}: SignInParams): Promise<boolean> => {
  try {
    await _signInWithEmailAndPassword(auth, email, password);
    return true;
    // const user = AUTH.currentUser;
  } catch (error) {
    console.error("Error during sign in with password:", error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<string> => {
  const provider = new _GoogleAuthProvider();
  const userData = await _signInWithPopup(auth, provider);

  const oldUser = await checkIfUserExists(userData.user.email as string);
  // If the user id not old create a new document to the User otherwise return empty string
  if (!oldUser) {
    await createUserInFirestore(userData.user.uid, {
      email: userData.user.email as string,
      displayName: userData.user.displayName as string,
      photoURL: userData.user.photoURL as string,
    });
    return userData.user.uid;
  }
  return "";
};

export const signUp = async ({
  email,
  password,
}: SignUpParams): Promise<string> => {
  try {
    const newUser = await _createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await createUserInFirestore(newUser.user.uid, {
      email: newUser.user.email as string,
      displayName: newUser.user.displayName as string,
      photoURL: newUser.user.photoURL as string,
    });

    return newUser.user.uid;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  await _signOut(auth);
};
