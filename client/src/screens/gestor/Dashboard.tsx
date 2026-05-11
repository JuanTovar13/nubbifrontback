import { colors, fonts } from "../../tokens";
import { TopBar } from "../../components/PhoneFrame";
import { BottomNav, gestorNav } from "../../components/BottomNav";
import { useActividades } from "../../providers/ActividadesProvider";
import { useInteraccionesAgregadas, type Interaccion } from "../../providers/InteraccionesProvider";

const calcAida = (interacciones: Interaccion[]) => {
  const total = interacciones.length;
  const pct = (n: number) => total === 0 ? 0 : Math.round((n / total) * 100);
  return [
    { label: "Atención", valor: pct(interacciones.filter((i) => i.atencion).length), color: colors.blue },
    { label: "Interés",  valor: pct(interacciones.filter((i) => i.interes).length),  color: colors.orange },
    { label: "Deseo",    valor: pct(interacciones.filter((i) => i.deseo).length),    color: colors.pink },
    { label: "Acción",   valor: pct(interacciones.filter((i) => i.accion).length),   color: colors.teal },
  ];
};

export const DashboardScreen = () => {
  const { actividades, loading: loadingActs } = useActividades();
  const actividadIds = actividades.map((a) => a.id);
  const { interacciones, loading: loadingInts } = useInteraccionesAgregadas(actividadIds);

  const loading = loadingActs || loadingInts;
  const aida = calcAida(interacciones);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh" }}>
      <TopBar />
      <div style={{
        flex: 1, overflowY: "auto", background: colors.offWhite,
        padding: "12px 14px 64px", display: "flex", flexDirection: "column", gap: 12,
      }}>

        <div style={{
          background: `linear-gradient(135deg, ${colors.orange}, ${colors.orangeLight})`,
          borderRadius: 16, padding: "14px 16px", color: "white",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, fontFamily: fonts.body }}>Dashboard</div>
            <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2, fontFamily: fonts.body }}>
              Análisis de compromiso AIDA
            </div>
          </div>
          {loading && (
            <div style={{ fontSize: 10, background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 10px", fontFamily: fonts.body }}>
              Cargando...
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "🎯", valor: String(actividades.length),      label: "Actividades",     color: colors.blue,   bg: colors.blueLight       },
            { icon: "💬", valor: String(interacciones.length),    label: "Interacciones",   color: colors.teal,   bg: colors.tealLight       },
            { icon: "📊", valor: `${aida[3]?.valor ?? 0}%`,      label: "Tasa de acción",  color: colors.orange, bg: colors.orangeVeryLight },
            { icon: "⭐", valor: `${aida[1]?.valor ?? 0}%`,      label: "Tasa de interés", color: colors.pink,   bg: "#FFF0F3"              },
          ].map((m, i) => (
            <div key={i} style={{ background: m.bg, borderRadius: 14, padding: "14px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.color, fontFamily: fonts.body }}>{m.valor}</div>
              <div style={{ fontSize: 10, color: colors.textLight, marginTop: 2, fontFamily: fonts.body }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: colors.text, fontFamily: fonts.body, marginBottom: 14 }}>
            Modelo AIDA
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {aida.map((etapa) => (
              <div key={etapa.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: colors.text, fontFamily: fonts.body }}>
                    {etapa.label}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: etapa.color, fontFamily: fonts.body }}>
                    {etapa.valor}%
                  </span>
                </div>
                <div style={{ height: 8, background: colors.gray200, borderRadius: 4 }}>
                  <div style={{
                    width: `${etapa.valor}%`, height: "100%", borderRadius: 4,
                    background: `linear-gradient(90deg, ${etapa.color}80, ${etapa.color})`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {!loading && interacciones.length === 0 && (
            <div style={{ marginTop: 14, fontSize: 11, color: colors.textLight, fontFamily: fonts.body, textAlign: "center" }}>
              Aún no hay interacciones registradas.
            </div>
          )}
        </div>

      </div>
      <BottomNav items={gestorNav} />
    </div>
  );
};
