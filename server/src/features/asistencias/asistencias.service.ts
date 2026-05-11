import { pool } from "../../config/database";
import { getActividadByQrPayloadService } from "../actividades/actividades.service";
import { Asistencia, ScanQRDTO, ScanResult } from "./asistencias.types";
import Boom from "@hapi/boom";

export const scanQRService = async (
  data: ScanQRDTO,
  profileId: string
): Promise<ScanResult> => {
  const { qr_payload } = data;

  const actividad = await getActividadByQrPayloadService(qr_payload);
  if (!actividad) throw Boom.badRequest("QR inválido o actividad no encontrada");

  const existing = await pool.query(
    `SELECT id FROM asistencias WHERE profile_id = $1 AND actividad_id = $2 LIMIT 1`,
    [profileId, actividad.id]
  );

  if (existing.rowCount && existing.rowCount > 0) {
    throw Boom.conflict("Ya registraste tu asistencia a esta actividad");
  }

  const result = await pool.query<Asistencia>(
    `INSERT INTO asistencias (profile_id, actividad_id, qr_payload_usado)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [profileId, actividad.id, qr_payload]
  );

  return { asistencia: result.rows[0] };
};

export const getBalanceService = async (_profileId: string): Promise<number> => {
  return 0;
};

export const getHistorialService = async (profileId: string) => {
  const result = await pool.query(
    `SELECT a.*, act.titulo, act.fecha_inicio, act.fecha_fin, act.imagen_url
     FROM asistencias a
     JOIN actividades act ON act.id = a.actividad_id
     WHERE a.profile_id = $1
     ORDER BY a.escaneado_at DESC`,
    [profileId]
  );

  return result.rows;
};
