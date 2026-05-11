export interface Asistencia {
  id: string;
  profile_id: string;
  actividad_id: string;
  qr_payload_usado: string;
  escaneado_at: string;
}

export interface ScanQRDTO {
  qr_payload: string;
}

export interface ScanResult {
  asistencia: Asistencia;
}
