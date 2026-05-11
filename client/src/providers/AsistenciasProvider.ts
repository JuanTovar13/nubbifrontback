import { useState, useEffect } from "preact/hooks";
import { useAxios } from "./AxiosProvider";

export interface ScanResult {
  asistencia: { id: string; profile_id: string; actividad_id: string; qr_payload_usado: string; escaneado_at: string };
}

export const useBalance = () => {
  const axios = useAxios();
  const [puntos, setPuntos] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<{ total: number }>("/api/asistencias/balance")
      .then(({ data }) => setPuntos(data.total))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { puntos, loading };
};

export const useScanQR = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ScanResult | null>(null);

  const scan = async (qr_payload: string) => {
    setLoading(true);
    setError(null);
    setResultado(null);
    try {
      const { data } = await axios.post<ScanResult>("/api/asistencias/scan", { qr_payload });
      setResultado(data);
      return data;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al escanear";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { scan, loading, error, resultado };
};
