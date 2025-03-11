export interface AuthContextType {
  isAuthenticated: boolean;
  profileData?: Object | null;
  login: (data: { token: string; refresh: string }) => void;
  logout: () => void;
}
