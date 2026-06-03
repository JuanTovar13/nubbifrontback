import { gestorNav } from "../../components/BottomNav";
import { ComunidadScreen } from "../../components/ComunidadScreen";

export const ComunidadGestorScreen = () => (
  <ComunidadScreen
    basePath="/gestor/comunidad"
    navItems={gestorNav}
    headerSubtitle="Gestiona y modera los canales de comunicación"
    roomLabel="canal"
    roomIcon="📢"
    roomFallbackDesc="Canal de comunicación"
    showAdminBadge
  />
);
