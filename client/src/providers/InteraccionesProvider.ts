import { useState, useEffect, useCallback } from "preact/hooks";
import { useAxios } from "./AxiosProvider";

export interface Interaccion {
  id: string;
  actividad_id: string;
  profile_id: string;
  atencion: boolean;
  interes: boolean;
  deseo: boolean;
  accion: boolean;
  created_at: string;
  updated_at: string;
}

export interface InteraccionConActividad extends Interaccion {
  titulo: string;
  fecha_inicio: string;
  fecha_fin: string | null;
}

export const useMiHistorialInteracciones = () => {
  const axios = useAxios();
  const [historial, setHistorial] = useState<Map<string, InteraccionConActividad>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<InteraccionConActividad[]>("/api/interacciones/mi-historial")
      .then(({ data }) => {
        const map = new Map<string, InteraccionConActividad>();
        data.forEach((h) => map.set(h.actividad_id, h));
        setHistorial(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upsertLocal = (actividadId: string, updated: Interaccion) => {
    setHistorial((prev) => {
      const next = new Map(prev);
      const existing = prev.get(actividadId);
      next.set(actividadId, {
        ...updated,
        titulo: existing?.titulo ?? "",
        fecha_inicio: existing?.fecha_inicio ?? "",
        fecha_fin: existing?.fecha_fin ?? null,
      });
      return next;
    });
  };

  const marcarInteres = async (actividadId: string) => {
    const existing = historial.get(actividadId);
    if (existing?.interes) return;
    if (!existing) {
      const { data } = await axios.post<Interaccion>("/api/interacciones", { actividad_id: actividadId, interes: true });
      upsertLocal(actividadId, data);
    } else {
      const { data } = await axios.patch<Interaccion>(`/api/interacciones/${existing.id}`, { interes: true });
      upsertLocal(actividadId, data);
    }
  };

  const marcarDeseo = async (actividadId: string) => {
    const existing = historial.get(actividadId);
    if (existing?.deseo) return;
    if (!existing) {
      const { data } = await axios.post<Interaccion>("/api/interacciones", { actividad_id: actividadId, deseo: true });
      upsertLocal(actividadId, data);
    } else {
      const { data } = await axios.patch<Interaccion>(`/api/interacciones/${existing.id}`, { deseo: true });
      upsertLocal(actividadId, data);
    }
  };

  return { historial, loading, marcarInteres, marcarDeseo };
};

export const useInteraccionesByActividad = (actividadId: string) => {
  const axios = useAxios();
  const [interacciones, setInteracciones] = useState<Interaccion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Interaccion[]>(`/api/interacciones/actividad/${actividadId}`);
      setInteracciones(data);
    } catch {
      setInteracciones([]);
    } finally {
      setLoading(false);
    }
  }, [actividadId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { interacciones, loading };
};

export const useInteraccionesAgregadas = (actividadIds: string[]) => {
  const axios = useAxios();
  const [interacciones, setInteracciones] = useState<Interaccion[]>([]);
  const [loading, setLoading] = useState(false);

  const key = actividadIds.join(",");

  useEffect(() => {
    if (actividadIds.length === 0) return;
    setLoading(true);
    const all: Interaccion[] = [];
    Promise.all(
      actividadIds.map((id) =>
        axios.get<Interaccion[]>(`/api/interacciones/actividad/${id}`)
          .then(({ data }) => all.push(...data))
          .catch(() => {})
      )
    ).finally(() => {
      setInteracciones(all);
      setLoading(false);
    });
  }, [key]);

  return { interacciones, loading };
};
