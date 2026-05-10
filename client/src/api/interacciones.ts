import { apiCall } from "./client";

export interface Interaccion {
  id: string;
  actividad_id: string;
  profile_id: string;
  atencion: boolean;
  interes: boolean;
  deseo: boolean;
  accion: boolean;
  puntos_ganados: number;
  created_at: string;
  updated_at: string;
}

export interface InteraccionConActividad extends Interaccion {
  actividades: { titulo: string; fecha: string; puntos: number };
}

export const createInteraccion = (data: {
  actividad_id: string;
  atencion?: boolean;
  interes?: boolean;
  deseo?: boolean;
  accion?: boolean;
}) =>
  apiCall<Interaccion>("/interacciones", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateInteraccion = (
  id: string,
  data: { atencion?: boolean; interes?: boolean; deseo?: boolean; accion?: boolean }
) =>
  apiCall<Interaccion>(`/interacciones/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getMiHistorial = () =>
  apiCall<InteraccionConActividad[]>("/interacciones/mi-historial");

export const getInteraccionesByActividad = (actividadId: string) =>
  apiCall<Interaccion[]>(`/interacciones/actividad/${actividadId}`);
