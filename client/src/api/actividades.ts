import { apiCall } from "./client";

export interface Actividad {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  ubicacion: string | null;
  qr_payload: string;
  puntos: number;
  activa: boolean;
  created_by: string;
  created_at: string;
}

export interface CreateActividadDTO {
  titulo: string;
  descripcion?: string;
  fecha: string;
  ubicacion?: string;
  puntos?: number;
}

export const getActividades = (soloActivas = false) =>
  apiCall<Actividad[]>(`/actividades${soloActivas ? "?activas=true" : ""}`);

export const getActividad = (id: string) =>
  apiCall<Actividad>(`/actividades/${id}`);

export const createActividad = (data: CreateActividadDTO) =>
  apiCall<Actividad>("/actividades", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateActividad = (id: string, data: Partial<CreateActividadDTO & { activa: boolean }>) =>
  apiCall<Actividad>(`/actividades/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteActividad = (id: string) =>
  apiCall<void>(`/actividades/${id}`, { method: "DELETE" });
