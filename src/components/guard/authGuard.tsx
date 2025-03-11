import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.isAuthenticated) {
      router.push("/accounts/signin");
    }
  }, [auth?.isAuthenticated, router]);

  if (!auth?.isAuthenticated) return null;

  return <>{children}</>;
}
