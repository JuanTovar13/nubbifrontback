import { useState } from "preact/hooks";
import { colors, fonts } from "../../tokens";
import { TopBar } from "../../components/PhoneFrame";
import { BottomNav, familiaNav } from "../../components/BottomNav";
import { scanQR } from "../../api/asistencias";

export const EscanearQRScreen = () => {
  const [payload, setPayload] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{ puntos_ganados: number; puntos_total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: Event) => {
    e.preventDefault();
    if (!payload.trim()) return;
    setLoading(true);
    setError(null);
    setResultado(null);
    try {
      const res = await scanQR(payload.trim());
      setResultado({ puntos_ganados: res.puntos_ganados, puntos_total: res.puntos_total });
      setPayload("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al escanear el código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh" }}>
      <TopBar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: colors.offWhite,
        padding: 20,
        paddingBottom: 64,
        overflowY: "auto",
      }}>

        <div style={{ fontSize: 17, fontWeight: 800, color: colors.text, marginBottom: 6, fontFamily: fonts.body }}>
          Escanear código QR
        </div>
        <div style={{ fontSize: 11, color: colors.textLight, textAlign: "center", marginBottom: 24, fontFamily: fonts.body }}>
          Ingresa el código QR de la actividad para registrar tu asistencia.
        </div>

        {/* Visor decorativo */}
        <div style={{
          width: 220,
          height: 220,
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          background: "#1a1a2e",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              position: "absolute",
              width: 100,
              height: 100,
              border: `3px solid ${colors.teal}`,
              borderRadius: 8,
              opacity: 0.5,
            }} />
          </div>

          {[
            { top: 10, left: 10,   borderTop: true,    borderLeft: true  },
            { top: 10, right: 10,  borderTop: true,    borderRight: true },
            { bottom: 10, left: 10,  borderBottom: true, borderLeft: true  },
            { bottom: 10, right: 10, borderBottom: true, borderRight: true },
          ].map((corner, i) => (
            <div key={i} style={{
              position: "absolute",
              width: 20,
              height: 20,
              top:    corner.top,
              left:   corner.left,
              right:  corner.right,
              bottom: corner.bottom,
              borderColor: colors.teal,
              borderStyle: "solid",
              borderTopWidth:    corner.borderTop    ? 3 : 0,
              borderLeftWidth:   corner.borderLeft   ? 3 : 0,
              borderRightWidth:  corner.borderRight  ? 3 : 0,
              borderBottomWidth: corner.borderBottom ? 3 : 0,
              borderRadius: 3,
            }} />
          ))}

          <div style={{
            position: "absolute",
            left: 10,
            right: 10,
            height: 2,
            top: "50%",
            background: `linear-gradient(90deg, transparent, ${colors.teal}, transparent)`,
            boxShadow: `0 0 8px ${colors.teal}`,
          }} />
        </div>

        {/* Resultado exitoso */}
        {resultado && (
          <div style={{
            marginTop: 20,
            width: "100%",
            background: colors.greenLight,
            borderRadius: 12,
            padding: "14px 16px",
            textAlign: "center",
            border: `1px solid ${colors.green}40`,
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.green, fontFamily: fonts.body }}>
              ¡Asistencia registrada!
            </div>
            <div style={{ fontSize: 12, color: colors.textLight, fontFamily: fonts.body, marginTop: 4 }}>
              +{resultado.puntos_ganados} puntos · Total: {resultado.puntos_total}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 20,
            width: "100%",
            background: "#FFF0F3",
            borderRadius: 12,
            padding: "12px 16px",
            textAlign: "center",
            border: `1px solid ${colors.pinkDark}30`,
          }}>
            <div style={{ fontSize: 12, color: colors.pinkDark, fontFamily: fonts.body }}>{error}</div>
          </div>
        )}

        {/* Input + botón */}
        <form onSubmit={handleScan} style={{ marginTop: 20, width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            placeholder="Pega aquí el código QR"
            type="text"
            value={payload}
            onInput={(e) => setPayload((e.target as HTMLInputElement).value)}
            style={{
              width: "100%",
              background: "white",
              borderRadius: 12,
              padding: "10px 14px",
              border: `1px solid ${colors.gray200}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              fontSize: 13,
              fontFamily: fonts.body,
              color: colors.text,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            disabled={loading || !payload.trim()}
            style={{
              padding: "12px 0",
              background: loading || !payload.trim() ? colors.gray300 : colors.teal,
              border: "none",
              borderRadius: 12,
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: loading || !payload.trim() ? "not-allowed" : "pointer",
              fontFamily: fonts.body,
              transition: "background 0.2s",
            }}
          >
            {loading ? "Registrando..." : "Registrar asistencia"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: colors.textLight, fontFamily: fonts.body }}>
            El gestor del evento te dará el código QR de la actividad.
          </div>
        </div>

      </div>
      <BottomNav items={familiaNav} />
    </div>
  );
};
