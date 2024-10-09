"use client";

import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useMemo, useEffect, useCallback } from "react";

import { AuthContext } from "../context/auth-context";

import type { AuthState } from "./types";
import { useSetState } from "@/hooks/use-set-state";
import { auth, firestore } from "@/config/firebase";

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });
  const checkUserSession = useCallback(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: AuthState["user"]) => {
        if (user) {
          const userProfile = doc(firestore, "users", user.uid);
          const docSnap = await getDoc(userProfile);
          const profileData = docSnap.data();

          setState({
            user: { ...user, ...profileData },
            loading: false,
          });
        } else {
          setState({
            user: null,
            loading: false,
          });
        }
      },
    );

    return unsubscribe;
  }, [setState]);

  useEffect(() => {
    const unsubscribe = checkUserSession();
    return () => unsubscribe();
  }, [checkUserSession]);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            id: state.user?.uid,
            accessToken: state.user?.accessToken,
            displayName: state.user?.displayName,
            photoURL: state.user?.photoURL,
            role: state.user?.role ?? "admin",
          }
        : null,
      checkUserSession,
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
    }),
    [checkUserSession, state.user, status],
  );
  return (
    <AuthContext.Provider
      value={{
        ...memoizedValue,
        checkUserSession: async () => {
          const unsubscribe = checkUserSession();
          await new Promise<void>((resolve) => {
            unsubscribe();
            resolve();
          });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext };
