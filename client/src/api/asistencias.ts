import { apiCall } from "./client";

export interface ScanResult {
  asistencia: {
    id: string;
    user_id: string;
    actividad_id: string;
    created_at: string;
  };
  puntos_ganados: number;
  puntos_total: number;
}

export interface AsistenciaHistorial {
  id: string;
  user_id: string;
  actividad_id: string;
  created_at: string;
  actividades: { titulo: string; fecha: string; puntos: number };
}

export const scanQR = (qr_payload: string) =>
  apiCall<ScanResult>("/asistencias/scan", {
    method: "POST",
    body: JSON.stringify({ qr_payload }),
  });

export const getBalance = () =>
  apiCall<{ total: number }>("/asistencias/balance");

export const getHistorial = () =>
  apiCall<AsistenciaHistorial[]>("/asistencias/historial");
