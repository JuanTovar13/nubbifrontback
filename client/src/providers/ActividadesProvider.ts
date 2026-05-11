import { useState, useEffect, useCallback } from "preact/hooks";
import { useAxios } from "./AxiosProvider";

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

export const useActividades = (soloActivas = false) => {
  const axios = useAxios();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<Actividad[]>(
        `/api/actividades`
      );
      setActividades(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error cargando actividades");
    } finally {
      setLoading(false);
    }
  }, [soloActivas]);

  useEffect(() => { fetch(); }, [fetch]);

  return { actividades, loading, error, refetch: fetch };
};

export const useCreateActividad = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crear = async (dto: CreateActividadDTO): Promise<Actividad> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post<Actividad>("/api/actividades", dto);
      return data;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error creando actividad";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { crear, loading, error };
};
