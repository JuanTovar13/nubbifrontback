import { apiCall } from "./client";
import type { UserRole } from "../types";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export const login = (email: string, password: string) =>
  apiCall<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (data: {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}) =>
  apiCall<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getProfile = () => apiCall<AuthUser>("/auth/me");
