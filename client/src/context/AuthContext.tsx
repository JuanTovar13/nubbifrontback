import { createContext } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { login as apiLogin, register as apiRegister, type AuthUser } from "../api/auth";
import type { UserRole } from "../types";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserRole>;
  register: (data: { email: string; password: string; full_name: string; role: UserRole }) => Promise<UserRole>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => "familia",
  register: async () => "familia",
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ComponentChildren }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("nubbi_token");
    const storedUser = localStorage.getItem("nubbi_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("nubbi_token");
        localStorage.removeItem("nubbi_user");
      }
    }
    setIsLoading(false);
  }, []);

  const saveSession = (accessToken: string, userData: AuthUser) => {
    localStorage.setItem("nubbi_token", accessToken);
    localStorage.setItem("nubbi_user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const login = async (email: string, password: string): Promise<UserRole> => {
    const res = await apiLogin(email, password);
    saveSession(res.access_token, res.user);
    return res.user.role;
  };

  const register = async (data: {
    email: string;
    password: string;
    full_name: string;
    role: UserRole;
  }): Promise<UserRole> => {
    const res = await apiRegister(data);
    saveSession(res.access_token, res.user);
    return res.user.role;
  };

  const logout = () => {
    localStorage.removeItem("nubbi_token");
    localStorage.removeItem("nubbi_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
