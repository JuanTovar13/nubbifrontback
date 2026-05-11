export type UserRole = "familia" | "gestor";

export interface RegisterDTO {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthSessionDTO {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    full_name: string;
  };
  session: AuthSessionDTO;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
