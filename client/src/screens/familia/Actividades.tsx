import { useState, useEffect } from "preact/hooks";
import { colors, fonts } from "../../tokens";
import { TopBar } from "../../components/PhoneFrame";
import { BottomNav, familiaNav } from "../../components/BottomNav";
import { getActividades, type Actividad } from "../../api/actividades";
import { createInteraccion, updateInteraccion, getMiHistorial, type InteraccionConActividad } from "../../api/interacciones";

const formatFecha = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
};

const formatHora = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
};

const ActividadCard = ({
  act,
  interaccion,
  onExpand,
  onParticipar,
}: {
  act: Actividad;
  interaccion: InteraccionConActividad | undefined;
  onExpand: () => void;
  onParticipar: () => void;
}) => {
  const [abierta, setAbierta] = useState(false);

  const handleExpand = () => {
    const siguiente = !abierta;
    setAbierta(siguiente);
    if (siguiente) onExpand();
  };

  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
    }}>
      <button
        onClick={handleExpand}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: colors.pinkLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}>
          🎯
        </div>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: colors.text, fontFamily: fonts.body }}>
          {act.titulo}
        </span>
        <span style={{
          fontSize: 18,
          color: colors.gray500,
          transform: abierta ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          lineHeight: 1,
        }}>
          ›
        </span>
      </button>

      {abierta && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ height: 1, background: colors.gray200, marginBottom: 14 }} />

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, minWidth: 90 }}>
              {[
                { icon: "📅", value: formatFecha(act.fecha) },
                { icon: "🕐", value: formatHora(act.fecha) },
                { icon: "📍", value: act.ubicacion ?? "Por definir" },
              ].map(({ icon, value }) => (
                <div key={icon} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span style={{ fontSize: 13, lineHeight: 1.4 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.body, lineHeight: 1.4 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <p style={{
              flex: 1,
              fontSize: 12,
              color: colors.textLight,
              fontFamily: fonts.body,
              lineHeight: 1.6,
              margin: 0,
            }}>
              {act.descripcion ?? "Sin descripción disponible."}
            </p>
          </div>

          <button
            onClick={onParticipar}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "11px 0",
              background: interaccion?.deseo ? colors.green : colors.pinkDark,
              border: "none",
              borderRadius: 12,
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: fonts.body,
              boxShadow: `0 4px 14px ${colors.pinkDark}40`,
              transition: "background 0.2s",
            }}
          >
            {interaccion?.deseo ? "✓ Participando" : "Participar"}
          </button>
        </div>
      )}
    </div>
  );
};

export const ActividadesScreen = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [historial, setHistorial] = useState<Map<string, InteraccionConActividad>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getActividades(true), getMiHistorial()]).then(([acts, hist]) => {
      setActividades(acts);
      const map = new Map<string, InteraccionConActividad>();
      hist.forEach((h) => map.set(h.actividad_id, h));
      setHistorial(map);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleExpand = async (actividadId: string) => {
    const existing = historial.get(actividadId);
    try {
      if (!existing) {
        const nueva = await createInteraccion({ actividad_id: actividadId, interes: true });
        setHistorial((prev) => {
          const next = new Map(prev);
          next.set(actividadId, { ...nueva, actividades: { titulo: "", fecha: "", puntos: 0 } });
          return next;
        });
      } else if (!existing.interes) {
        const updated = await updateInteraccion(existing.id, { interes: true });
        setHistorial((prev) => {
          const next = new Map(prev);
          next.set(actividadId, { ...existing, ...updated });
          return next;
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleParticipar = async (actividadId: string) => {
    const existing = historial.get(actividadId);
    try {
      if (!existing) {
        const nueva = await createInteraccion({ actividad_id: actividadId, deseo: true });
        setHistorial((prev) => {
          const next = new Map(prev);
          next.set(actividadId, { ...nueva, actividades: { titulo: "", fecha: "", puntos: 0 } });
          return next;
        });
      } else if (!existing.deseo) {
        const updated = await updateInteraccion(existing.id, { deseo: true });
        setHistorial((prev) => {
          const next = new Map(prev);
          next.set(actividadId, { ...existing, ...updated });
          return next;
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh" }}>
      <TopBar />
      <div style={{ flex: 1, background: colors.offWhite, overflowY: "auto", paddingBottom: 64 }}>
        <div style={{
          background: `linear-gradient(135deg, ${colors.pink})`,
          padding: "16px 20px 20px",
        }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "white", fontFamily: fonts.body }}>
            Actividades
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2, fontFamily: fonts.body }}>
            Elige una actividad y participa con tu familia
          </div>
        </div>

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: 40, color: colors.textLight, fontFamily: fonts.body, fontSize: 13 }}>
              Cargando actividades...
            </div>
          )}
          {!loading && actividades.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: colors.textLight, fontFamily: fonts.body, fontSize: 13 }}>
              No hay actividades disponibles por ahora.
            </div>
          )}
          {actividades.map((act) => (
            <ActividadCard
              key={act.id}
              act={act}
              interaccion={historial.get(act.id)}
              onExpand={() => handleExpand(act.id)}
              onParticipar={() => handleParticipar(act.id)}
            />
          ))}
        </div>
      </div>
      <BottomNav items={familiaNav} />
    </div>
  );
};
