import { supabase } from "../../config/supabase";
import { pool } from "../../config/database";
import { RegisterDTO, LoginDTO, AuthResponse } from "./auth.types";
import Boom from "@hapi/boom";

export type RegisterResult =
  | { type: "success"; data: AuthResponse }
  | { type: "email_confirmation"; message: string };

export const registerUserService = async (
  data: RegisterDTO
): Promise<RegisterResult> => {
  const { email, password, full_name, role = "familia" } = data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError) throw Boom.badRequest(authError.message);

  const userId = authData.user?.id;
  if (!userId) throw Boom.internal("Error creando usuario");
  
  
  
  await pool.query(
    `INSERT INTO profiles (id, email, full_name, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE
     SET email = $2, full_name = $3, role = $4`,
    [userId, email, full_name, role]
  );

  if (!authData.session) {
    return {
      type: "email_confirmation",
      message: "Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.",
    };
  }

  return {
    type: "success",
    data: {
      user: { id: userId, email, role, full_name },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      },
    },
  };
};

export const loginUserService = async (data: LoginDTO): Promise<AuthResponse> => {
  const { email, password } = data;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw Boom.unauthorized(error.message || "Credenciales inválidas");
  if (!authData.user || !authData.session) throw Boom.unauthorized("Usuario no encontrado");

  const result = await pool.query(
    "SELECT id, email, full_name, role FROM profiles WHERE id = $1 LIMIT 1",
    [authData.user.id]
  );

  if (result.rowCount === 0) throw Boom.notFound("Perfil no encontrado");

  const profile = result.rows[0];

  return {
    user: {
      id: authData.user.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name,
    },
    session: {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
    },
  };
};

export const refreshTokenService = async (refreshToken: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session || !data.user) {
    throw Boom.unauthorized("Sesión expirada, inicia sesión nuevamente");
  }

  const result = await pool.query(
    "SELECT id, email, full_name, role FROM profiles WHERE id = $1 LIMIT 1",
    [data.user.id]
  );

  if (result.rowCount === 0) throw Boom.notFound("Perfil no encontrado");

  const profile = result.rows[0];

  return {
    user: {
      id: data.user.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  };
};

export const getProfileService = async (userId: string) => {
  const result = await pool.query(
    "SELECT id, email, full_name, role FROM profiles WHERE id = $1 LIMIT 1",
    [userId]
  );

  if (result.rowCount === 0) throw Boom.notFound("Perfil no encontrado");

  return result.rows[0];
};
