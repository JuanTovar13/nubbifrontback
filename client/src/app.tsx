// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
// Aquí se decide qué pantalla mostrar según el rol y la navegación.
// No hay librería de rutas — el estado maneja todo con useState.

import { useState } from "preact/hooks";
import type { UserRole, Screen } from "./types";

// Selector de rol
import { RoleSelector } from "./screens/RoleSelector";

// Pantallas de Familia
import { HomeFamiliaScreen   } from "./screens/familia/HomeFamilia";
import { ComunidadScreen     } from "./screens/familia/Comunidad";
import { EscanearQRScreen    } from "./screens/familia/EscanearQR";
import { ActividadesScreen      } from "./screens/familia/Actividades";

// Pantallas de Gestor
import { HomeGestorScreen    } from "./screens/gestor/HomeGestor";
import { CrearActividadScreen} from "./screens/gestor/CrearActividad";
import { DashboardScreen     } from "./screens/gestor/Dashboard";

export const App = () => {
  // null = todavía no eligió rol
  const [rol,     setRol    ] = useState<UserRole | null>(null);
  const [pantalla, setPantalla] = useState<Screen>("home-familia");

  // Cuando elige el rol, definimos la pantalla inicial según cuál eligió
  const elegirRol = (r: UserRole) => {
    setRol(r);
    setPantalla(r === "familia" ? "home-familia" : "home-gestor");
  };

  // Función que pasan todas las pantallas para navegar entre ellas
  const navegar = (s: Screen) => setPantalla(s);

  // Si no eligió rol todavía, mostramos el selector
  if (!rol) return <RoleSelector onSelect={elegirRol} />;

  return (
    <>
      {pantalla === "home-familia"    && <HomeFamiliaScreen    onNav={navegar} />}
      {pantalla === "comunidad"       && <ComunidadScreen      onNav={navegar} />}
      {pantalla === "escanear-qr"     && <EscanearQRScreen     onNav={navegar} />}
      {pantalla === "actividades"     && <ActividadesScreen    onNav={navegar} />}
      {pantalla === "home-gestor"     && <HomeGestorScreen     onNav={navegar} />}
      {pantalla === "crear-actividad" && <CrearActividadScreen onNav={navegar} />}
      {pantalla === "dashboard"       && <DashboardScreen      onNav={navegar} />}
    </>
  );
};