export interface Actividad {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha_inicio: string;
  ubicacion: string | null;
  qr_payload: string;
  imagen_url: string | null;
  creada_por: string;
  created_at: string;
}

export interface CreateActividadDTO {
  titulo: string;
  descripcion?: string;
  fecha_inicio: string;
  ubicacion?: string;
  imagen_url?: string;
}

export interface UpdateActividadDTO {
  titulo?: string;
  descripcion?: string;
  fecha_inicio?: string;
  ubicacion?: string;
  imagen_url?: string;
}
