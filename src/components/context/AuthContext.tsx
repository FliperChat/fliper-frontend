"use client";

import { AuthContextType } from "@/utils/types";
import { getCookie } from "cookies-next";
import { deleteCookie, setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: string | undefined;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!auth || false);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("at");
    setIsAuthenticated(!!token);
  }, []);

  const login = (data: { token: string; refresh: string }) => {
    setCookie("at", data.token, { maxAge: 60 * 60 * 24 * 7 });
    setCookie("rt", data.refresh, { maxAge: 60 * 60 * 24 * 7 });
    setIsAuthenticated(true);
    router.push("/");
  };

  const logout = () => {
    deleteCookie("at");
    deleteCookie("rt");
    setIsAuthenticated(false);
    router.push("/accounts");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
