import { Request, Response } from "express";
import Boom from "@hapi/boom";
import {
  getProfileService,
  loginUserService,
  registerUserService,
  refreshTokenService,
  type RegisterResult,
} from "./auth.service";
import { LoginDTO, RegisterDTO } from "./auth.types";
import { AuthRequest } from "../../middlewares/authMiddleware";

const getErrorMessage = (error: unknown, defaultMessage: string) => {
  if (error instanceof Error) return error.message;
  return defaultMessage;
};

const getStatusCode = (error: unknown, defaultStatus: number) => {
  if (Boom.isBoom(error)) return error.output.statusCode;
  return defaultStatus;
};

export class AuthController {
  static async register(req: Request<unknown, unknown, RegisterDTO>, res: Response) {
    try {
      const result: RegisterResult = await registerUserService(req.body);
      if (result.type === "email_confirmation") {
        return res.status(202).json({ message: result.message });
      }
      res.status(201).json(result.data);
    } catch (error: unknown) {
      res.status(getStatusCode(error, 400)).json({ error: getErrorMessage(error, "Registro fallido") });
    }
  }

  static async login(req: Request<unknown, unknown, LoginDTO>, res: Response) {
    try {
      const result = await loginUserService(req.body);
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(getStatusCode(error, 401)).json({ error: getErrorMessage(error, "Login fallido") });
    }
  }

  static async refresh(req: Request<unknown, unknown, { refreshToken: string }>, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: "refreshToken requerido" });
      }
      const result = await refreshTokenService(refreshToken);
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(getStatusCode(error, 401)).json({ error: getErrorMessage(error, "No se pudo renovar la sesión") });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      const user = req.user;
      if (!user?.id) throw new Error("Usuario no autenticado");
      const profile = await getProfileService(user.id);
      res.status(200).json(profile);
    } catch (error: unknown) {
      res.status(getStatusCode(error, 401)).json({ error: getErrorMessage(error, "No se pudo obtener el perfil") });
    }
  }
}
