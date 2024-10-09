"use client";

import { useState, useEffect, useCallback } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { paths } from "@/routes/paths";

import { useAuthContext } from "@/hooks/use-auth-context";
import LoadingScreen from "@/components/loaders/loading-screen";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!authenticated) {
      const signInPath = paths.auth.login;
      const returnTo = `${pathname}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      const token = searchParams.get("token");
      let href = `${signInPath}?${createQueryString("returnTo", returnTo)}`;
      if (token) {
        href += `&token=${token}`;
      }
      router.replace(href);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading, pathname]);

  if (isChecking) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
