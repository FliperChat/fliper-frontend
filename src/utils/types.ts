import { locales } from "./constants";

export type Locale = (typeof locales)[number];

export type Themes = "dark" | "light";

export interface ProfileData {
  name: string;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  profileData?: ProfileData | null;
  login: (data: { token: string; refresh: string }) => void;
  logout: () => void;
}

export type TranslationContextType = {
  translations: TranslationType;
  lang: string;
  setLang: (newLang: string, namespaces: string[]) => Promise<void>;
};

export type TranslationType = Record<string, Record<string, string>>;

export interface ThemeContextType {
  theme: Themes | string;
  toggleTheme: () => void;
}
