import { familiaNav } from "../../components/BottomNav";
import { ComunidadScreen } from "../../components/ComunidadScreen";

export const ComunidadScreenFamilia = () => (
  <ComunidadScreen
    basePath="/familia/comunidad"
    navItems={familiaNav}
    headerSubtitle="Conecta y conversa con otras familias"
    roomLabel="grupo"
    roomIcon="💬"
    roomFallbackDesc="Toca para abrir el chat"
    showInfoTab
    showFab
  />
);
