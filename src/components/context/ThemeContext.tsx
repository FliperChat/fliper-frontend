"use client";

import { ThemeContextType, Themes } from "@/utils/types";
import { setCookie } from "cookies-next";
import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Themes | string;
}) {
  const [theme, setTheme] = useState<Themes | string>(initialTheme || "dark");

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setCookie("theme", newTheme);
  }

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
