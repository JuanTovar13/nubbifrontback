import { createContext } from "preact";// Cambiado a Preact
import { useContext, useState } from "preact/hooks";// Cambiado a Preact
import type { ComponentChildren } from "preact";// Importamos el tipo ComponentChildren para tipar los children del provider
import { useNavigate } from "react-router-dom";// Importamos useNavigate para redirigir al usuario después de login/logout
import { useAxios } from "./AxiosProvider";// Asegúrate de que este hook esté adaptado para Preact
import { useToast } from "./ToastProvider";// Asegúrate de que este hook esté adaptado para Preact
import { getStoredAuth, setStoredAuth, removeStoredAuth } from "../utils/storage";// Funciones para manejar el almacenamiento del estado de autenticación en localStorage o sessionStorage  
import type { AuthData, AuthUser, UserRole } from "../types";// Importamos los tipos relacionados con la autenticación para tipar correctamente el estado y las funciones del contexto de autenticación

interface AuthContextType {// Definición de la interfaz para el contexto de autenticación, que incluye el estado de autenticación, el estado de carga y las funciones para login, registro y logout
  auth: AuthData | null;// Estado que almacena la información de autenticación del usuario, que puede ser null si no hay un usuario autenticado
  isLoading: boolean;// Estado que indica si una operación de autenticación (login o registro) está en progreso, para mostrar un indicador de carga en la interfaz de usuario
  login: (email: string, password: string) => Promise<void>;// Función para iniciar sesión, que recibe el email y la contraseña del usuario, realiza una petición a la API para autenticar al usuario, actualiza el estado de autenticación y redirige al usuario a la página correspondiente según su rol  
  register: (email: string, password: string, full_name: string, role: UserRole) => Promise<void>;// Función para registrar un nuevo usuario, que recibe el email, la contraseña, el nombre completo y el rol del usuario, realiza una petición a la API para crear la cuenta, actualiza el estado de autenticación y redirige al usuario a la página correspondiente según su rol (o muestra un mensaje si se requiere confirmación de email)
  logout: () => void;// Función para cerrar sesión, que limpia el estado de autenticación y redirige al usuario a la página de inicio o login
}

const AuthContext = createContext<AuthContextType>({// Creación del contexto de autenticación con un valor por defecto que incluye el estado de autenticación, el estado de carga y las funciones para login, registro y logout, aunque estas funciones no hacen nada en el valor por defecto 
  auth: null,// El estado de autenticación por defecto es null, lo que indica que no hay un usuario autenticado
  isLoading: false,// El estado de carga por defecto es false, lo que indica que no hay una operación de autenticación en progreso
  login: async () => {},// La función de login por defecto es una función asíncrona vacía, que no hace nada, pero se define como asíncrona para que el tipo sea correcto y para que los componentes que usen esta función puedan manejarla como una promesa
  register: async () => {},// La función de registro por defecto es una función asíncrona vacía, que no hace nada, pero se define como asíncrona para que el tipo sea correcto y para que los componentes que usen esta función puedan manejarla como una promesa
  logout: () => {},// La función de logout por defecto es una función vacía, que no hace nada, pero se define para que los componentes que usen esta función puedan llamarla sin preocuparse por si el contexto está correctamente configurado o no (aunque en realidad deberían asegurarse de usar el AuthProvider para que el contexto esté disponible)
});

export const AuthProvider = ({ children }: { children: ComponentChildren }) => {// Componente proveedor del contexto de autenticación, que envuelve a los componentes que necesitan acceder al estado de autenticación y a las funciones de login, registro y logout, y proporciona el valor del contexto con el estado y las funciones correspondientes  
  const [auth, setAuthState] = useState<AuthData | null>(getStoredAuth);// Estado para almacenar la información de autenticación del usuario, que se inicializa con el valor almacenado en localStorage o sessionStorage (si existe) a través de la función getStoredAuth, lo que permite mantener la sesión del usuario incluso después de recargar la página
  const [isLoading, setIsLoading] = useState(false);// Estado para indicar si una operación de autenticación (login o registro) está en progreso, lo que permite mostrar un indicador de carga en la interfaz de usuario mientras se realiza la operación
  const axios = useAxios();// Hook personalizado para hacer peticiones HTTP con Axios, que se utiliza para realizar las peticiones a la API en las funciones de login y registro
  const navigate = useNavigate();// Hook de React Router para redirigir al usuario a diferentes páginas después de login, registro o logout, dependiendo de su rol o de la acción realizada
  const { showToast } = useToast();// Hook personalizado para mostrar notificaciones (toasts) en la interfaz de usuario, que se utiliza para mostrar mensajes de éxito o error durante las operaciones de autenticación, como al iniciar sesión, registrarse o si ocurre un error durante estas operaciones

  const setAuth = (value: AuthData | null) => {// Función para actualizar el estado de autenticación del usuario, que también se encarga de almacenar o eliminar la información de autenticación en localStorage o sessionStorage según corresponda, lo que permite mantener la sesión del usuario incluso después de recargar la página  
    if (value) setStoredAuth(value);// Si se proporciona un valor de autenticación, se almacena en localStorage o sessionStorage a través de la función setStoredAuth, lo que permite mantener la sesión del usuario incluso después de recargar la página
    else removeStoredAuth();// Si se proporciona un valor nulo, se elimina la información de autenticación de localStorage o sessionStorage a través de la función removeStoredAuth, lo que cierra la sesión del usuario y evita que la sesión se mantenga después de recargar la página  
    setAuthState(value);// Finalmente, se actualiza el estado de autenticación con el nuevo valor, lo que permite que los componentes que consumen este contexto se actualicen con la nueva información de autenticación y puedan mostrar la interfaz correspondiente según el estado del usuario (autenticado o no, y su rol)
  };

  const login = async (email: string, password: string) => {// Función para iniciar sesión, que recibe el email y la contraseña del usuario, realiza una petición a la API para autenticar al usuario, actualiza el estado de autenticación y redirige al usuario a la página correspondiente según su rol  
    setIsLoading(true);// Indica que la operación de login está en progreso, lo que permite mostrar un indicador de carga en la interfaz de usuario mientras se realiza el login
    try {
      const { data } = await axios.post<AuthData>("/api/auth/login", { email, password });// Realiza una petición POST a la API para autenticar al usuario, enviando el email y la contraseña en el cuerpo de la petición, y esperando un objeto AuthData como respuesta que contiene la información de autenticación del usuario (como el token de acceso y los datos del usuario) 
      setAuth(data);// Actualiza el estado de autenticación con la información obtenida de la respuesta de la API, lo que también almacena esta información en localStorage o sessionStorage para mantener la sesión del usuario incluso después de recargar la página
      navigate(data.user.role === "familia" ? "/familia" : "/gestor");// Redirige al usuario a la página correspondiente según su rol (familia o gestor) después de iniciar sesión exitosamente, lo que mejora la experiencia del usuario al llevarlo directamente a la sección de la aplicación que le corresponde según su rol  
    } catch (err) {// Si ocurre un error durante la petición de login, se muestra un mensaje de error en la interfaz de usuario a través del hook useToast, y se re-lanza el error para que el formulario de login pueda manejarlo si lo desea (por ejemplo, mostrando un mensaje específico para el campo de email o contraseña)
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";// El mensaje de error se obtiene del objeto de error si es una instancia de Error, o se establece un mensaje genérico si no lo es, lo que permite mostrar un mensaje de error adecuado en la interfaz de usuario incluso si el error no es un objeto de error estándar  
      showToast(msg, "error");// Muestra un mensaje de error en la interfaz de usuario utilizando el hook useToast, lo que proporciona una retroalimentación visual al usuario sobre el error ocurrido durante el login
      throw err;// Re-lanza el error para que el formulario de login pueda manejarlo si lo desea, lo que permite una mayor flexibilidad en la forma en que se muestra el error al usuario (por ejemplo, mostrando un mensaje específico para el campo de email o contraseña, o mostrando una notificación general)
    } finally {// Finalmente, independientemente de si la operación de login fue exitosa o no, se indica que la operación ha finalizado, lo que permite ocultar el indicador de carga en la interfaz de usuario
      setIsLoading(false);// Indica que la operación de login ha finalizado, lo que permite ocultar el indicador de carga en la interfaz de usuario y permitir que el usuario interactúe nuevamente con el formulario de login si es necesario
    }// El bloque try-catch-finally asegura que el estado de carga se actualice correctamente y que cualquier error se maneje adecuadamente, proporcionando una experiencia de usuario fluida incluso en caso de problemas durante el proceso de login
  };// El hook devuelve una función login que puede ser utilizada por los componentes que consumen este contexto para iniciar sesión, y el estado de carga para mostrar un indicador de carga mientras se realiza el login

  const register = async (email: string, password: string, full_name: string, role: UserRole) => {// Función para registrar un nuevo usuario, que recibe el email, la contraseña, el nombre completo y el rol del usuario, realiza una petición a la API para crear la cuenta, actualiza el estado de autenticación y redirige al usuario a la página correspondiente según su rol (o muestra un mensaje si se requiere confirmación de email)  
    setIsLoading(true);// Indica que la operación de registro está en progreso, lo que permite mostrar un indicador de carga en la interfaz de usuario mientras se realiza el registro
    try {
      const { data, status } = await axios.post<AuthData | { message: string }>(//  Realiza una petición POST a la API para crear una nueva cuenta de usuario, enviando el email, la contraseña, el nombre completo y el rol en el cuerpo de la petición, y esperando un objeto AuthData como respuesta si el registro es exitoso, o un objeto con un campo message si se requiere confirmación de email (como en el caso de Supabase)
        "/api/auth/register",// Endpoint de la API para registrar un nuevo usuario
        { email, password, full_name, role }// Cuerpo de la petición con los datos necesarios para registrar un nuevo usuario, incluyendo el email, la contraseña, el nombre completo y el rol del usuario
      );
      if (status === 202) {// Si la respuesta de la API tiene un status 202, significa que el registro fue exitoso pero se requiere confirmación de email (como en el caso de Supabase), por lo que se muestra un mensaje al usuario indicando que debe confirmar su email antes de poder iniciar sesión, y se lanza un error para que el formulario de registro pueda manejarlo si lo desea (por ejemplo, mostrando un mensaje específico para el campo de email)
        // Supabase requiere confirmación de email
        const msg = (data as { message: string }).message;// El mensaje se obtiene del campo message de la respuesta de la API, que indica que se ha enviado un email de confirmación al usuario y que debe confirmar su email antes de poder iniciar sesión  
        showToast(msg, "success");// Muestra un mensaje de éxito en la interfaz de usuario utilizando el hook useToast, lo que proporciona una retroalimentación visual al usuario sobre el éxito del registro y la necesidad de confirmar su email antes de poder iniciar sesión
        throw new Error(msg);
      }// Si el registro fue exitoso y no se requiere confirmación de email, se actualiza el estado de autenticación con la información obtenida de la respuesta de la API, lo que también almacena esta información en localStorage o sessionStorage para mantener la sesión del usuario incluso después de recargar la página, y se redirige al usuario a la página correspondiente según su rol (familia o gestor) después de registrarse exitosamente, lo que mejora la experiencia del usuario al llevarlo directamente a la sección de la aplicación que le corresponde según su rol
      const authData = data as AuthData;// Se asume que la respuesta de la API es un objeto AuthData si el registro fue exitoso y no se requiere confirmación de email, lo que permite actualizar el estado de autenticación con esta información y redirigir al usuario a la página correspondiente según su rol
      setAuth(authData);// Actualiza el estado de autenticación con la información obtenida de la respuesta de la API, lo que también almacena esta información en localStorage o sessionStorage para mantener la sesión del usuario incluso después de recargar la página
      navigate(authData.user.role === "familia" ? "/familia" : "/gestor");// Redirige al usuario a la página correspondiente según su rol (familia o gestor) después de registrarse exitosamente, lo que mejora la experiencia del usuario al llevarlo directamente a la sección de la aplicación que le corresponde según su rol 
    } catch (err) {// Si ocurre un error durante la petición de registro, se muestra un mensaje de error en la interfaz de usuario a través del hook useToast, y se re-lanza el error para que el formulario de registro pueda manejarlo si lo desea (por ejemplo, mostrando un mensaje específico para el campo de email o contraseña)
      // Re-lanzar para que el formulario lo maneje si quiere
      throw err;// El error se maneja en el formulario de registro para mostrar un mensaje específico al usuario, lo que proporciona una mejor experiencia de usuario al mostrar mensajes de error claros y específicos para cada campo del formulario (por ejemplo, si el email ya está registrado, si la contraseña no cumple con los requisitos, etc.)
    } finally {// Finalmente, independientemente de si la operación de registro fue exitosa o no, se indica que la operación ha finalizado, lo que permite ocultar el indicador de carga en la interfaz de usuario
      setIsLoading(false);// Indica que la operación de registro ha finalizado, lo que permite ocultar el indicador de carga en la interfaz de usuario y permitir que el usuario interactúe nuevamente con el formulario de registro si es necesario
    }// El bloque try-catch-finally asegura que el estado de carga se actualice correctamente y que cualquier error se maneje adecuadamente, proporcionando una experiencia de usuario fluida incluso en caso de problemas durante el proceso de registro
  };//  El hook devuelve una función register que puede ser utilizada por los componentes que consumen este contexto para registrar un nuevo usuario, y el estado de carga para mostrar un indicador de carga mientras se realiza el registro

  const logout = () => {// Función para cerrar sesión, que limpia el estado de autenticación y redirige al usuario a la página de inicio o login, lo que permite al usuario cerrar su sesión de manera segura y volver a la página de inicio o login para iniciar sesión con otra cuenta si lo desea
    setAuth(null);//  Limpia el estado de autenticación estableciéndolo en null, lo que también elimina la información de autenticación almacenada en localStorage o sessionStorage, lo que cierra la sesión del usuario y evita que la sesión se mantenga después de recargar la página
    navigate("/");// Redirige al usuario a la página de inicio o login después de cerrar sesión, lo que proporciona una mejor experiencia de usuario al llevarlo a la página principal de la aplicación después de cerrar sesión, donde puede iniciar sesión nuevamente o navegar por la aplicación como usuario no autenticado
  };

  return (// El componente proveedor del contexto de autenticación envuelve a los componentes hijos con el AuthContext.Provider, proporcionando el valor del contexto que incluye el estado de autenticación, el estado de carga y las funciones para login, registro y logout, lo que permite a los componentes hijos acceder a esta información y funciones a través del contexto de autenticación para mostrar la interfaz correspondiente según el estado del usuario (autenticado o no, y su rol) y para realizar operaciones de autenticación como iniciar sesión, registrarse o cerrar sesión
    <AuthContext.Provider value={{ auth, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { // Hook personalizado para acceder al contexto de autenticación, que devuelve el valor del contexto y lanza un error si se intenta usar fuera del AuthProvider, lo que garantiza que los componentes que consumen este hook tengan acceso al contexto de autenticación correctamente configurado 
  const ctx = useContext(AuthContext);  // Utiliza el hook useContext para acceder al valor del contexto de autenticación, lo que permite a los componentes que usan este hook obtener el estado de autenticación, el estado de carga y las funciones para login, registro y logout proporcionadas por el AuthProvider
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");// Si el contexto no está disponible (lo que significa que este hook se está usando fuera del AuthProvider), se lanza un error para alertar al desarrollador de que debe envolver su componente con el AuthProvider para que el contexto esté disponible, lo que ayuda a prevenir errores de uso y garantiza que los componentes tengan acceso al contexto de autenticación correctamente configurado
  // El hook devuelve el valor del contexto de autenticación, que incluye el estado de autenticación, el estado de carga y las funciones para login, registro y logout, lo que permite a los componentes que usan este hook acceder a esta información y funciones para mostrar la interfaz correspondiente según el estado del usuario (autenticado o no, y su rol) y para realizar operaciones de autenticación como iniciar sesión, registrarse o cerrar sesión
  return ctx;// El hook devuelve el valor del contexto de autenticación, que incluye el estado de autenticación, el estado de carga y las funciones para login, registro y logout, lo que permite a los componentes que usan este hook acceder a esta información y funciones para mostrar la interfaz correspondiente según el estado del usuario (autenticado o no, y su rol) y para realizar operaciones de autenticación como iniciar sesión, registrarse o cerrar sesión
};

// Helper para obtener el usuario directamente
export const useAuthUser = (): AuthUser | null => useAuth().auth?.user ?? null;
