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
