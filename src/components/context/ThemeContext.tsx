import { ThemeMode } from "@/utils/enums";
import { ThemeContextType } from "@/utils/types";
import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext<ThemeContextType>({
  theme: ThemeMode.DARK,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDarkScheme =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme =
    typeof window !== "undefined" ? localStorage.getItem("theme") : null;
  const initialTheme =
    savedTheme ||
    (prefersDarkScheme ? ThemeMode.DARK : ThemeMode.LIGHT) ||
    ThemeMode.DARK;

  const [theme, setTheme] = useState<ThemeMode | string>(initialTheme);

  function toggleTheme() {
    const newTheme =
      theme === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
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
