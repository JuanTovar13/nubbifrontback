import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { useNavigate } from "react-router-dom";
import { useAxios } from "./AxiosProvider";
import { useToast } from "./ToastProvider";
import { getStoredAuth, setStoredAuth, removeStoredAuth } from "../utils/storage";
import type { AuthData, AuthUser, UserRole } from "../types";

interface AuthContextType {
  auth: AuthData | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ComponentChildren }) => {
  const [auth, setAuthState] = useState<AuthData | null>(getStoredAuth);
  const [isLoading, setIsLoading] = useState(false);
  const axios = useAxios();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const setAuth = (value: AuthData | null) => {
    if (value) setStoredAuth(value);
    else removeStoredAuth();
    setAuthState(value);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post<AuthData>("/api/auth/login", { email, password });
      setAuth(data);
      navigate(data.user.role === "familia" ? "/familia" : "/gestor");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
      showToast(msg, "error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, full_name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const { data, status } = await axios.post<AuthData | { message: string }>(
        "/api/auth/register",
        { email, password, full_name, role }
      );
      if (status === 202) {
        // Supabase requiere confirmación de email
        const msg = (data as { message: string }).message;
        showToast(msg, "success");
        throw new Error(msg);
      }
      const authData = data as AuthData;
      setAuth(authData);
      navigate(authData.user.role === "familia" ? "/familia" : "/gestor");
    } catch (err) {
      // Re-lanzar para que el formulario lo maneje si quiere
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuth(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ auth, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// Helper para obtener el usuario directamente
export const useAuthUser = (): AuthUser | null => useAuth().auth?.user ?? null;
