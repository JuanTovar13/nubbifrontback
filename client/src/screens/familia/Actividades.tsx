// ─── PANTALLA PROGRESO — FLUJO FAMILIA ───────────────────────────────────────
// Mapa de aventura con paradas. Juan ve en qué punto del recorrido está
// su familia y qué actividades ha completado.

import { colors, fonts } from "../../tokens";
import {  TopBar } from "../../components/PhoneFrame";
import { BottomNav, familiaNav } from "../../components/BottomNav";
import { NubbiOwl } from "../../components/NubbiLogo";
import type { ScreenProps } from "../../types";


export const ActividadesScreen = ({ onNav }: ScreenProps) => (
  <div>
    <TopBar onBack={() => onNav("home-familia")} title="Actividades" />

    

    <BottomNav active="actividades" onNav={onNav} items={familiaNav} />
  </div>
);