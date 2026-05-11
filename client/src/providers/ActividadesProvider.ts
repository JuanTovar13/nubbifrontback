import { useState, useEffect, useCallback } from "preact/hooks"; // Cambiado a Preact 
import { useAxios } from "./AxiosProvider"; // Asegúrate de que este hook esté adaptado para Preact

export interface Actividad { // Definición de la interfaz Actividad
  id: string; // ID único de la actividad
  titulo: string; // Título de la actividad 
  descripcion: string | null; //  Descripción de la actividad, puede ser null
  fecha_inicio: string; // Fecha de inicio de la actividad en formato ISO
  ubicacion: string | null; //  Ubicación de la actividad, puede ser null
  qr_payload: string; //  Payload para el código QR asociado a la actividad 
  imagen_url: string | null; // URL de la imagen asociada a la actividad, puede ser null  
  creada_por: string; //  ID del usuario que creó la actividad
  created_at: string; // Fecha de creación de la actividad en formato ISO 
}// Puedes ajustar los tipos según lo que realmente devuelva tu API

export interface CreateActividadDTO { // DTO para crear una nueva actividad
  titulo: string;// Título de la actividad (requerido)
  descripcion?: string;// Descripción de la actividad (opcional)
  fecha_inicio: string;// Fecha de inicio de la actividad en formato ISO (requerido)
  ubicacion?: string;// Ubicación de la actividad (opcional)
  imagen_url?: string;// URL de la imagen asociada a la actividad (opcional)
}

export const useActividades = (soloActivas = false) => {// Hook para obtener la lista de actividades, con opción de filtrar solo las activas
  const axios = useAxios();// Hook personalizado para hacer peticiones HTTP con Axios
  const [actividades, setActividades] = useState<Actividad[]>([]);//  Estado para almacenar la lista de actividades obtenida de la API
  const [loading, setLoading] = useState(true);// Estado para indicar si la carga de actividades está en progreso
  const [error, setError] = useState<string | null>(null);// Estado para almacenar cualquier error que ocurra durante la carga de actividades

  const fetch = useCallback(async () => {// Función para cargar las actividades desde la API  
    setLoading(true);// Indica que la carga está en progreso
    setError(null);// Reinicia el estado de error antes de intentar cargar las actividades
    try {
      const { data } = await axios.get<Actividad[]>(//    Realiza una petición GET a la API para obtener la lista de actividades, esperando un array de objetos Actividad como respuesta
        `/api/actividades`// Puedes agregar un query param para filtrar solo las activas si tu API lo soporta, por ejemplo: `/api/actividades?soloActivas=${soloActivas}`
      );
      setActividades(data);// Actualiza el estado con la lista de actividades obtenida de la API
    } catch (e: unknown) {// Si ocurre un error durante la petición, actualiza el estado de error con el mensaje correspondiente
      setError(e instanceof Error ? e.message : "Error cargando actividades");//    El mensaje de error se obtiene del objeto de error si es una instancia de Error, o se establece un mensaje genérico si no lo es
    } finally {// Finalmente, independientemente de si la petición fue exitosa o no, se indica que la carga ha finalizado
      setLoading(false);// Indica que la carga ha finalizado
    }
  }, [soloActivas]);// La función fetch se memoriza con useCallback para evitar recrearla en cada renderizado, y solo se volverá a crear si cambia el valor de soloActivas

  useEffect(() => { fetch(); }, [fetch]); // useEffect para llamar a la función fetch cuando el componente se monta o cuando la función fetch cambia (lo que ocurre si cambia soloActivas)  

  return { actividades, loading, error, refetch: fetch };// El hook devuelve un objeto con la lista de actividades, el estado de carga, el estado de error y una función refetch para volver a cargar las actividades manualmente si es necesario 
};

export const useCreateActividad = () => {// Hook para crear una nueva actividad a través de la API  
  const axios = useAxios();// Hook personalizado para hacer peticiones HTTP con Axios
  const [loading, setLoading] = useState(false);//    Estado para indicar si la creación de la actividad está en progreso
  const [error, setError] = useState<string | null>(null);// Estado para almacenar cualquier error que ocurra durante la creación de la actividad

  const crear = async (dto: CreateActividadDTO): Promise<Actividad> => {//  Función para crear una nueva actividad, recibe un objeto CreateActividadDTO con los datos necesarios para crear la actividad y devuelve una promesa que resuelve con el objeto Actividad creado
    setLoading(true);// Indica que la creación de la actividad está en progreso
    setError(null);// Reinicia el estado de error antes de intentar crear la actividad
    try {
      const { data } = await axios.post<Actividad>("/api/actividades", dto);//  Realiza una petición POST a la API para crear una nueva actividad, enviando el objeto dto como cuerpo de la petición, y esperando un objeto Actividad como respuesta
      return data;// Devuelve el objeto Actividad creado que se obtiene de la respuesta de la API
    } catch (e: unknown) {// Si ocurre un error durante la petición, actualiza el estado de error con el mensaje correspondiente y lanza un nuevo error con ese mensaje
      const msg = e instanceof Error ? e.message : "Error creando actividad";// El mensaje de error se obtiene del objeto de error si es una instancia de Error, o se establece un mensaje genérico si no lo es
      setError(msg);// Actualiza el estado de error con el mensaje correspondiente
      throw new Error(msg);// Lanza un nuevo error con el mensaje correspondiente para que el componente que use este hook pueda manejarlo si lo desea
    } finally {// Finalmente, independientemente de si la petición fue exitosa o no, se indica que la creación ha finalizado
      setLoading(false);// Indica que la creación de la actividad ha finalizado
    }// El hook devuelve un objeto con la función crear para crear una nueva actividad, el estado de carga y el estado de error para que el componente que use este hook pueda manejar estos estados según sea necesario
  };

  return { crear, loading, error };// El hook devuelve un objeto con la función crear para crear una nueva actividad, el estado de carga y el estado de error para que el componente que use este hook pueda manejar estos estados según sea necesario
};
