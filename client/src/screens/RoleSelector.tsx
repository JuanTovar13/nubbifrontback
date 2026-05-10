import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../tokens";
import { Dancing, NubbiLogo, NubbiBall, NubbiRabbit } from "../components/NubbiLogo";
import type { UserRole } from "../types";

export const RoleSelector = () => {
  const navigate = useNavigate();

  const onSelect = (rol: UserRole) => {
    navigate(rol === "familia" ? "/familia" : "/gestor");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${colors.orangeVeryLight} 0%, ${colors.tealLight} 100%)`,
      fontFamily: fonts.body,
      padding: 40,
    }}>
      <NubbiLogo size={180} />
      <Dancing size={250} />

      <p style={{
        color: colors.textLight,
        fontSize: 14,
        marginBottom: 40,
        textAlign: "center",
        fontFamily: fonts.body,
      }}>
        Selecciona tu perfil para continuar
      </p>

      <div style={{ display: "flex", gap: 20 }}>
        {[
          {
            rol:       "familia" as UserRole,
            label:     "Miembro de Familia",
            color:     colors.pink,
            bg:        colors.pinkLight,
            textColor: colors.white,
            mascota:   <NubbiBall size={60} />,
          },
          {
            rol:       "gestor" as UserRole,
            label:     "Miembro Gestor",
            color:     colors.blue,
            bg:        colors.blueLight,
            textColor: colors.white,
            mascota:   <NubbiRabbit size={60} />,
          },
        ].map((opcion) => (
          <button
            key={opcion.rol}
            onClick={() => onSelect(opcion.rol)}
            style={{
              background: opcion.color,
              border: `3px solid ${opcion.color}`,
              borderRadius: 20,
              padding: "24px 20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              boxShadow: `0 8px 24px ${opcion.color}30`,
              width: 148,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 36px ${opcion.color}40`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${opcion.color}30`;
            }}
          >
            <div style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: opcion.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {opcion.mascota}
            </div>

            <span style={{
              fontSize: 12,
              color: opcion.textColor,
              textAlign: "center",
              fontFamily: fonts.body,
            }}>
              {opcion.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
