export interface Asistencia {// Interfaz para representar la información de una asistencia registrada, lo que permite a los componentes de esta pantalla acceder a esta información para mostrarla en la interfaz de usuario y proporcionar contexto sobre las asistencias registradas en la aplicación
  id: string;
  profile_id: string;
  actividad_id: string;
  qr_payload_usado: string;
  escaneado_at: string;
}

export interface ScanQRDTO {// Interfaz para representar los datos necesarios para realizar el escaneo de un QR para registrar una asistencia, lo que permite a los componentes de esta pantalla enviar esta información en la solicitud HTTP al backend para realizar la operación de escaneo y registro de asistencia, mejorando la gestión de datos al proporcionar una estructura clara para los datos necesarios en esta operación
  qr_payload: string;
}

export interface ScanResult {// Interfaz para representar el resultado del escaneo de un QR para registrar una asistencia, lo que permite a los componentes de esta pantalla recibir esta información en la respuesta HTTP del backend después de realizar la operación de escaneo y registro de asistencia, mejorando la gestión de datos al proporcionar una estructura clara para los datos devueltos por esta operación
  asistencia: Asistencia;
}
