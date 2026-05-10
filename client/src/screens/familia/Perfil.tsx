import { NubbiOwl } from "../../components/NubbiLogo";
import { colors, fonts } from "../../tokens";
import type { ScreenProps } from "../../types";


export const Perfil = ({ onNav }: ScreenProps) => {
    return (
        <div>
            {/* Banner de bienvenida con gradiente naranja */}
                  <div className="profile-banner" style={{
                    background: `linear-gradient(135deg, ${colors.orange} 0%, ${colors.orangeLight} 100%)`,
                    padding: "20px 20px 24px",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {/* Decoración de fondo */}
                    <div style={{ position: "absolute", right: -10, bottom: -10, opacity: 0.15, fontSize: 80 }}>⭐</div>
            
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      {/* Avatar del usuario */}
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
            
                      <div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontFamily: fonts.body }}>
                          ¡Bienvenido de nuevo!
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "white", fontFamily: fonts.body }}>
                          Juan
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", marginTop: 2, fontFamily: fonts.body }}>
                          Participa, aprende y ganen puntos juntos
                        </div>
                      </div>
                    </div>
            
                    {/* Badge de puntos */}
                    <div style={{
                      marginTop: 14,
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: 20,
                      padding: "6px 14px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}>
                      <span style={{ fontSize: 16 }}>⭐</span>
                      <span style={{ color: "white", fontWeight: 700, fontSize: 13, fontFamily: fonts.body }}>
                        1,240 puntos
                      </span>
                    </div>
                  </div>

        </div>
    )
}