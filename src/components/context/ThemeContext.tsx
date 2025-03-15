import { ThemeMode } from "@/utils/enums";
import { ThemeContextType } from "@/utils/types";
import { getCookie, setCookie } from "cookies-next";
import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext<ThemeContextType>({
  theme: ThemeMode.DARK,
  toggleTheme: () => {},
});

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: ThemeMode | string;
}) {
  const [theme, setTheme] = useState<ThemeMode | string>(
    initialTheme || ThemeMode.DARK
  );

  function toggleTheme() {
    const newTheme =
      theme === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    setTheme(newTheme);
    setCookie("theme", newTheme, { maxAge: 60 * 60 * 24 * 365 });
  }

  useEffect(() => {
    async function loadTheme() {
      const prefersDarkScheme =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      const savedTheme = await getCookie("theme");
      const initialTheme =
        savedTheme ||
        (prefersDarkScheme ? ThemeMode.DARK : ThemeMode.LIGHT) ||
        ThemeMode.DARK;

      setTheme(initialTheme);
      document.body.setAttribute("data-theme", initialTheme);
    }

    loadTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
