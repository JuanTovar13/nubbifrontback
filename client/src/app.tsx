import { Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "preact";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
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

const PrivateRoute = ({ children, role }: { children: JSX.Element; role?: UserRole }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to={`/${user.role}`} replace />;
  return children;
};

const AppRoutes = () => (
  <div style={{ display: "flex", minHeight: "100dvh" }}>
    <Routes>
      <Route path="/" element={<PublicRoute><LoginScreen /></PublicRoute>} />

      <Route path="/familia"             element={<PrivateRoute role="familia"><HomeFamiliaScreen /></PrivateRoute>} />
      <Route path="/familia/actividades" element={<PrivateRoute role="familia"><ActividadesScreen /></PrivateRoute>} />
      <Route path="/familia/comunidad"   element={<PrivateRoute role="familia"><ComunidadScreen /></PrivateRoute>} />
      <Route path="/familia/escanear-qr" element={<PrivateRoute role="familia"><EscanearQRScreen /></PrivateRoute>} />
      <Route path="/familia/perfil"      element={<PrivateRoute role="familia"><Perfil /></PrivateRoute>} />

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
