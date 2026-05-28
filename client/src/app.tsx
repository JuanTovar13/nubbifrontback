import { Routes, Route, Navigate } from "react-router-dom"; // Importación de componentes de React Router para definir las rutas de la aplicación, lo que permite a los componentes de esta pantalla redirigir a los usuarios a otras pantallas de la aplicación según las interacciones del usuario y controlar el acceso a ciertas rutas según el estado de autenticación del usuario
import type { JSX } from "preact";// Importación del tipo JSX para definir los tipos de los componentes, lo que permite a los desarrolladores tener una mejor experiencia de desarrollo al proporcionar autocompletado y verificación de tipos en los componentes de la aplicación

import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { RoleSelector }          from "./screens/RoleSelector";
import { LoginScreen }           from "./screens/Login";
import { HomeFamiliaScreen }     from "./screens/familia/HomeFamilia";
import { ActividadesScreen }     from "./screens/familia/Actividades";
import { ComunidadScreen }       from "./screens/familia/Comunidad";
import { EscanearQRScreen }      from "./screens/familia/EscanearQR";
import { Perfil }                from "./screens/familia/Perfil";
import { HomeGestorScreen }      from "./screens/gestor/HomeGestor";
import { CrearActividadScreen }  from "./screens/gestor/CrearActividad";
import { DashboardScreen }       from "./screens/gestor/Dashboard";
import { PerfilGestor }          from "./screens/gestor/PerfilGestor";
import { ComunidadGestorScreen } from "./screens/gestor/ComunidadGestor";
import type { UserRole } from "./types";
import { ChatScreen } from "./screens/chat/ChatScreen";

const PrivateRoute = ({ children, role }: { children: JSX.Element; role?: UserRole }) => {
  const { auth, isLoading } = useAuth();// Utiliza el hook useAuth para obtener el objeto de autenticación y su estado de carga, lo que permite a los componentes de esta pantalla controlar el acceso a ciertas rutas según el estado de autenticación del usuario y su rol, y mostrar un indicador de carga mientras se obtiene esta información
  if (isLoading) return null;// Si el estado de autenticación aún se está cargando, no renderiza nada (podría mostrar un spinner o indicador de carga aquí), lo que mejora la experiencia del usuario al evitar mostrar contenido incorrecto o redirigir prematuramente mientras se obtiene la información de autenticación
  if (!auth) return <Navigate to="/" replace />;// Si el usuario no está autenticado, redirige a la pantalla de selección de rol (que a su vez redirige a login), lo que mejora la experiencia del usuario al guiarlo hacia el proceso de autenticación para acceder a las funcionalidades protegidas de la aplicación
  if (role && auth.user.role !== role) return <Navigate to={`/${auth.user.role}`} replace />;// Si se especifica un rol y el rol del usuario autenticado no coincide, redirige a la ruta correspondiente al rol del usuario, lo que mejora la experiencia del usuario al garantizar que solo accedan a las partes de la aplicación que son relevantes para su rol y evitar confusiones o accesos no autorizados
  return children;// Si el usuario está autenticado y tiene el rol correcto (si se especifica), renderiza el componente hijo, lo que permite a los usuarios autorizados acceder a la ruta protegida y disfrutar de una experiencia personalizada y relevante dentro de la aplicación según su estado de autenticación y rol
};// Componente de ruta privada que controla el acceso a ciertas rutas según el estado de autenticación del usuario y su rol, lo que permite a los componentes de esta pantalla redirigir a los usuarios no autenticados a la pantalla de inicio de sesión y redirigir a los usuarios autenticados a la ruta correspondiente según su rol, lo que mejora la seguridad y la experiencia del usuario al garantizar que solo los usuarios autorizados puedan acceder a ciertas partes de la aplicación

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { auth, isLoading } = useAuth();
  if (isLoading) return null;
  if (auth) return <Navigate to={`/${auth.user.role}`} replace />;
  return children;
};

const AppRoutes = () => (
  <div style={{ display: "flex", minHeight: "100vh", width: "100%", justifyContent:"center"}}>
    <Routes>
      <Route path="/"      element={<PublicRoute><RoleSelector /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
      <Route path="/familia"             element={<PrivateRoute role="familia"><HomeFamiliaScreen /></PrivateRoute>} />
      <Route path="/familia/actividades" element={<PrivateRoute role="familia"><ActividadesScreen /></PrivateRoute>} />
      <Route path="/familia/comunidad"   element={<PrivateRoute role="familia"><ComunidadScreen /></PrivateRoute>} />
      <Route path="/familia/escanear-qr" element={<PrivateRoute role="familia"><EscanearQRScreen /></PrivateRoute>} />
      <Route path="/familia/perfil"      element={<PrivateRoute role="familia"><Perfil /></PrivateRoute>} />
      <Route path="/familia/comunidad/:roomId" element={<PrivateRoute role="familia"><ChatScreen /></PrivateRoute>} />
      <Route path="/gestor/comunidad/:roomId" element={<PrivateRoute role="gestor"><ChatScreen /></PrivateRoute>} />
      <Route path="/gestor"              element={<PrivateRoute role="gestor"><HomeGestorScreen /></PrivateRoute>} />
      <Route path="/gestor/actividades"  element={<PrivateRoute role="gestor"><CrearActividadScreen /></PrivateRoute>} />
      <Route path="/gestor/comunidad"    element={<PrivateRoute role="gestor"><ComunidadGestorScreen /></PrivateRoute>} />
      <Route path="/gestor/dashboard"    element={<PrivateRoute role="gestor"><DashboardScreen /></PrivateRoute>} />
      <Route path="/gestor/perfil"       element={<PrivateRoute role="gestor"><PerfilGestor /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
);

export const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);