import { useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../tokens";
import { TopBar } from "./PhoneFrame";
import { BottomNav, type NavItem } from "./BottomNav";
import { useRooms, useCreateRoom } from "../providers/ChatProvider";
import { useAuth } from "../providers/AuthProvider";

interface ComunidadScreenProps {
  /** Prefijo de ruta para navegar al chat, e.g. "/familia/comunidad" */
  basePath: string;
  /** Items del BottomNav según el rol */
  navItems: NavItem[];
  /** Texto secundario del header */
  headerSubtitle: string;
  /** Etiqueta singular del recurso: "grupo" | "canal" */
  roomLabel: string;
  /** Emoji del ícono de cada sala en la lista */
  roomIcon: string;
  /** Descripción por defecto si la sala no tiene descripción */
  roomFallbackDesc: string;
  /** Mostrar pestaña de información (solo familia) */
  showInfoTab?: boolean;
  /** Mostrar badge "ADMIN" en salas propias (solo gestor) */
  showAdminBadge?: boolean;
  /** Mostrar botón "+" flotante (FAB) en lugar del botón en el header */
  showFab?: boolean;
}

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return "ahora";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
};

export const ComunidadScreen = ({
  basePath,
  navItems,
  headerSubtitle,
  roomLabel,
  roomIcon,
  roomFallbackDesc,
  showInfoTab = false,
  showAdminBadge = false,
  showFab = false,
}: ComunidadScreenProps) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const myId = auth?.user.id ?? "";

  const { rooms, loading } = useRooms();
  const { createRoom, loading: creating } = useCreateRoom();

  const [showCreate, setShowCreate] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [tab, setTab] = useState<"chats" | "info">("chats");

  const handleCreate = async (e: Event) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    const room = await createRoom(newRoomName, myId, newRoomDesc);
    if (room) {
      setShowCreate(false);
      setNewRoomName("");
      setNewRoomDesc("");
      navigate(`${basePath}/${room.id}`, { state: { roomName: room.name } });
    }
  };

  const labelCapitalized = roomLabel.charAt(0).toUpperCase() + roomLabel.slice(1);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh" }}>
      <TopBar />

      {/* ── Modal crear sala ────────────────────────────────────────────── */}
      {showCreate && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "flex-end" }}
          onClick={() => setShowCreate(false)}
        >
          <div
            style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "24px 20px 80px", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 800, fontSize: 16, color: colors.text, fontFamily: fonts.body, marginBottom: 16 }}>
              Nuevo {roomLabel}
            </div>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                placeholder={`Nombre del ${roomLabel} *`}
                value={newRoomName}
                onInput={(e) => setNewRoomName((e.target as HTMLInputElement).value)}
                required
                autoFocus
                style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${colors.gray300}`, fontSize: 13, fontFamily: fonts.body, color: colors.text, outline: "none" }}
              />
              <input
                placeholder={`Descripción del ${roomLabel} (opcional)`}
                value={newRoomDesc}
                onInput={(e) => setNewRoomDesc((e.target as HTMLInputElement).value)}
                style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${colors.gray300}`, fontSize: 13, fontFamily: fonts.body, color: colors.text, outline: "none" }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  style={{ flex: 1, padding: "12px 0", background: colors.gray100, border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: fonts.body, color: colors.textLight }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating || !newRoomName.trim()}
                  style={{ flex: 2, padding: "12px 0", background: creating || !newRoomName.trim() ? colors.gray300 : colors.blue, border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: creating ? "not-allowed" : "pointer", fontFamily: fonts.body, color: "white" }}
                >
                  {creating ? "Creando…" : `Crear ${roomLabel}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div style={{ background: colors.blue, padding: "16px 20px", color: "white", flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: fonts.body }}>Comunidad Nubbi</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2, fontFamily: fonts.body }}>{headerSubtitle}</div>

          {showInfoTab && (
            <div style={{ display: "flex", background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: 3, marginTop: 12, gap: 2 }}>
              {(["chats", "info"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{ flex: 1, padding: "6px 0", borderRadius: 16, background: tab === t ? "white" : "transparent", color: tab === t ? colors.blue : "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: fonts.body, transition: "all 0.2s" }}
                >
                  {t === "chats" ? "Chats grupales" : "Información"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Pestaña Chats ─────────────────────────────────────────────── */}
        {(!showInfoTab || tab === "chats") && (
          <>
            <div style={{ padding: "10px 16px 6px", background: colors.gray100, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: fonts.body }}>
                {labelCapitalized}s disponibles ({rooms.length})
              </div>
              {!showFab && (
                <button
                  onClick={() => setShowCreate(true)}
                  style={{ background: colors.blue, border: "none", borderRadius: 8, padding: "4px 12px", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: fonts.body }}
                >
                  + Nuevo
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto", background: "white", paddingBottom: 80 }}>
              {loading && (
                <div style={{ padding: 32, textAlign: "center", color: colors.textLight, fontFamily: fonts.body, fontSize: 13 }}>
                  Cargando…
                </div>
              )}

              {!loading && rooms.length === 0 && (
                <div style={{ padding: 40, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>{roomIcon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: colors.text, fontFamily: fonts.body }}>
                    No hay {roomLabel}s aún
                  </div>
                  <div style={{ fontSize: 12, color: colors.textLight, fontFamily: fonts.body, marginTop: 6 }}>
                    Crea el primer {roomLabel} para tu comunidad
                  </div>
                </div>
              )}

              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => navigate(`${basePath}/${room.id}`, { state: { roomName: room.name } })}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${colors.gray100}`, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = colors.gray100; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.blue}, ${colors.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {roomIcon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: colors.text, fontFamily: fonts.body }}>{room.name}</span>
                      <span style={{ fontSize: 10, color: colors.textLight, fontFamily: fonts.body }}>{formatTime(room.created_at)}</span>
                    </div>
                    <div style={{ fontSize: 11, color: colors.textLight, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: fonts.body }}>
                      {room.description ?? roomFallbackDesc}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    {showAdminBadge && room.created_by === myId && (
                      <span style={{ fontSize: 9, background: colors.blueLight, color: colors.blue, borderRadius: 6, padding: "2px 6px", fontWeight: 700, fontFamily: fonts.body }}>
                        ADMIN
                      </span>
                    )}
                    <span style={{ color: colors.gray500, fontSize: 16 }}>›</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Pestaña Info (solo familia) ───────────────────────────────── */}
        {showInfoTab && tab === "info" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 20, paddingBottom: 80, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: colors.text, fontFamily: fonts.body, marginBottom: 8 }}>
                🌟 ¿Para qué sirve la Comunidad?
              </div>
              <div style={{ fontSize: 12, color: colors.textLight, fontFamily: fonts.body, lineHeight: 1.6 }}>
                La comunidad es el espacio donde familias como la tuya se conectan, comparten experiencias, se apoyan mutuamente y reciben información directa de los gestores de Nubbi.
              </div>
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: colors.text, fontFamily: fonts.body, marginBottom: 10 }}>
                📋 Normas de convivencia
              </div>
              {[
                "Respeta a todos los miembros de la comunidad",
                "Comparte experiencias constructivas y positivas",
                "No compartas información personal sensible",
                "Mantén el tema relacionado con las actividades",
              ].map((norma, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: colors.blue, fontSize: 13 }}>•</span>
                  <span style={{ fontSize: 12, color: colors.textLight, fontFamily: fonts.body, lineHeight: 1.4 }}>{norma}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAB (solo familia) */}
      {showFab && (
        <button
          onClick={() => setShowCreate(true)}
          style={{ position: "fixed", bottom: 80, right: 20, width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.blue}, ${colors.teal})`, border: "none", cursor: "pointer", fontSize: 22, color: "white", boxShadow: `0 6px 20px ${colors.blue}60`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}
        >
          +
        </button>
      )}

      <BottomNav items={navItems} />
    </div>
  );
};
