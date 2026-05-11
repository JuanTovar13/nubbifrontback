export type UserRole = "familia" | "gestor";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number; // Unix segundos
}

export interface AuthData {
  user: AuthUser;
  session: AuthSession;
}

export interface Creator {
  full_name: string;
  email: string;
}

export interface Room {
  id: string;
  name: string;
  created_at: string;
  created_by: Creator;
}

export interface Message {
  id: string;
  content: string;
  room_id: string;
  created_at: string;
  created_by: Creator;
}
