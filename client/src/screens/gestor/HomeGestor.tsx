import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../../tokens";
import {  TopBar } from "../../components/PhoneFrame";
import { BottomNav, gestorNav } from "../../components/BottomNav";
import { NubbiOwl } from "../../components/NubbiLogo";

export const HomeGestorScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar />
      <div style={{ flex: 1, overflowY: "auto", background: colors.offWhite, paddingBottom: 64 }}>

        

        {/* Menú de acciones */}
        <div style={{ padding: "16px 16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12, fontFamily: fonts.body }}>
            Acciones rápidas
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                icon: "🎯",
                label: "Crear Actividades",
                subtitle: "Comparte nuevas experiencias para que las familias participen y mantengan informadas el tema de las actividades.",
                color:   colors.pink,
                bgColor: colors.pinkLight,
                path:    "/gestor/actividades",
              },
              {
                icon: "👥",
                label: "Comunidad",
                subtitle: "Conversa, motiva y responde directamente a las dudas de los hogares.",
                color:   colors.blue,
                bgColor: colors.blueLight,
                path:    "/gestor",
              },
              
              {
                icon: "📊",
                label: "Dashboard",
                subtitle: "Analiza el compromiso de las familias y el impacto de tus actividades.",
                color:   colors.orange,
                bgColor: colors.orangeVeryLight,
                path:    "/gestor/dashboard",
              },
              {
                icon: "👤",
                label: "Perfil",
                subtitle: "",
                color:   colors.teal,
                bgColor: colors.tealLight,
                path:    "/gestor",
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: item.bgColor,
                  border: "none",
                  borderRadius: 14,
                  padding: "12px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  width: "100%",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: colors.text, fontFamily: fonts.body }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 10, color: colors.textLight, lineHeight: 1.4, marginTop: 2, fontFamily: fonts.body }}>
                    {item.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
      <BottomNav items={gestorNav} />
    </div>
  );
};
