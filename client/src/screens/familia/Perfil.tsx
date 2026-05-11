import { NubbiOwl } from "../../components/NubbiLogo";
import { TopBar } from "../../components/PhoneFrame";
import { BottomNav, familiaNav } from "../../components/BottomNav";
import { colors, fonts } from "../../tokens";
import { useAuth } from "../../providers/AuthProvider";
import { LogoutButton } from "../../components/LogoutButton";

export const Perfil = () => {
  const { auth } = useAuth();
  
  const user = auth?.user;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh" }}>
      <TopBar />
      <div style={{ flex: 1,display:"flex", flexDirection: "column", overflowY: "auto", background: colors.offWhite, paddingBottom: 64,alignItems:"center" }}>

        {/* Banner */}
        <div style={{
          background: colors.orange,
          padding: "40px 40px 40px",
          position: "relative",
          overflow: "hidden",
          width:"100%"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid rgba(255,255,255,0.6)",
            }}>
              <NubbiOwl size={44} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontFamily: fonts.body }}>
                ¡Bienvenido de nuevo!
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white", fontFamily: fonts.body }}>
                {user?.full_name ?? "Usuario"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: fonts.body }}>
                {user?.email}
              </div>
            </div>
          </div>

          
        </div>

        {/* Acciones */}
        <LogoutButton/>

      </div>
      <BottomNav items={familiaNav} />
    </div>
  );
};
