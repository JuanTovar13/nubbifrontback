import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../../tokens";
import {  TopBar } from "../../components/PhoneFrame";
import { BottomNav, familiaNav } from "../../components/BottomNav";


const MenuCard = ({
  icon,
  label,
  subtitle,
  color,
  bgColor,
  onClick,
}: {
  icon: string;
  label: string;
  subtitle: string;
  color: string;
  bgColor: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      background: bgColor,
      border: "none",
      borderRadius: 16,
      padding: "14px 12px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 6,
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      textAlign: "left",
      width: "100%",
      height: "30vh",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
    }}
  >
    <div style={{
      width: 36,
      height: 36,
      borderRadius: 10,
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
    }}>
      {icon}
    </div>
    <div style={{ fontWeight: 700, fontSize: 20, color: colors.text, fontFamily: fonts.body }}>
      {label}
    </div>
    <div style={{ fontSize: 10, color: colors.textLight, lineHeight: 1.3, fontFamily: fonts.body }}>
      {subtitle}
    </div>
  </button>
);

export const HomeFamiliaScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="HomeFamilia" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", height:"100vh" }}>
      <TopBar />
      <div style={{ flex: 1, overflowY: "auto", background: colors.offWhite, paddingBottom: 64 }}>

        {/* Grid del menú principal */}
        <div style={{ padding: "4vh 2vh 7vh" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 12, fontFamily: fonts.body }}>
            ¿Qué quieres hacer hoy?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <MenuCard
              icon="🎯"
              label="Actividades"
              subtitle="Elige desafíos para tu familia"
              color={colors.pink}
              bgColor={colors.pinkLight}
              onClick={() => navigate("/familia/actividades")}
            />
            
            <MenuCard
              icon="👥"
              label="Comunidad"
              subtitle="Conecta con otras familias"
              color={colors.blue}
              bgColor={colors.blueLight}
              onClick={() => navigate("/familia/comunidad")}
            />
            <MenuCard
              icon="📷"
              label="Escanear QR"
              subtitle="Registra asistencia y aprende"
              color={colors.teal}
              bgColor={colors.tealLight}
              onClick={() => navigate("/familia/escanear-qr")}
            />
            <MenuCard
              icon="👤"
              label="Perfil"
              subtitle=""
              color={colors.cream}
              bgColor={colors.creamLight}
              onClick={() => navigate("/familia/perfil")}
            />
          </div>
        </div>

        

      </div>
      <BottomNav items={familiaNav} />
    </div>
  );
};
