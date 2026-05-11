import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { pool } from "../config/database";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string | undefined;
    role: "familia" | "gestor";
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const result = await pool.query(
      "SELECT role FROM profiles WHERE id = $1 LIMIT 1",
      [data.user.id]
    );

    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: result.rows[0]?.role ?? "familia",
    };

    next();
  } catch (err) {
    res.status(401).json({ error: "Error de autenticación" });
  }
};
