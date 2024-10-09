"use client";

import { useContext } from "react";

import { AuthContext } from "@/auth/firebase/auth-context";
// ----------------------------------------------------------------------

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext: Context must be used inside AuthProvider");
  }

  return context;
}
