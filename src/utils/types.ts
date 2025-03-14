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
};

export type TranslationType = Record<string, Record<string, string>>;
