import { NubbiOwl } from "../../components/NubbiLogo";
import { TopBar } from "../../components/PhoneFrame";
import { BottomNav, gestorNav } from "../../components/BottomNav";
import { colors, fonts } from "../../tokens";
import { useAuth } from "../../providers/AuthProvider";
import { LogoutButton } from "../../components/LogoutButton";

export const PerfilGestor = () => {
  const { auth } = useAuth();
  const user = auth?.user;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", height:"100vh" }}>
      <TopBar/>
      <div style={{ flex: 1, overflowY: "auto", background: colors.offWhite, paddingBottom: 64 }}>

        {/* Banner de bienvenida */}
        <div style={{
          background: colors.teal,
          padding: "20px 20px 24px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.08, fontSize: 120 }}>
            ⚙️
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              border: "3px solid rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <NubbiOwl size={44} />
            </div>

            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontFamily: fonts.body }}>
                Panel de control
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "white", fontFamily: fonts.body }}>
                {user?.full_name ?? "Gestor"}
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontFamily: fonts.body }}>{user?.email?? "email"}</p>
            </div>
          </div>

         
        </div>

        {/* Contenido del perfil */}
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Botón cerrar sesión */}
          <LogoutButton/>
        </div>

      </div>
      <BottomNav items={gestorNav} />
    </div>
  );
};
