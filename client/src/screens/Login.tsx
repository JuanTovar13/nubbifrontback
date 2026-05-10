import { useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../tokens";
import { NubbiLogo } from "../components/NubbiLogo";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 12,
  fontSize: 13,
  border: `1px solid ${colors.gray300}`,
  background: "white",
  outline: "none",
  color: colors.text,
  fontFamily: fonts.body,
  width: "100%",
  boxSizing: "border-box" as const,
};

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register fields
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState<UserRole>("familia");

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userRole = await login(email, password);
      navigate(userRole === "familia" ? "/familia" : "/gestor");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userRole = await register({ email: regEmail, password: regPassword, full_name: fullName, role });
      navigate(userRole === "familia" ? "/familia" : "/gestor");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: `linear-gradient(160deg, ${colors.orangeVeryLight} 0%, ${colors.tealLight} 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
      fontFamily: fonts.body,
    }}>
      <div style={{ marginBottom: 8 }}>
        <NubbiLogo size={120} />
      </div>

      <div style={{
        width: "100%",
        maxWidth: 380,
        background: "white",
        borderRadius: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        overflow: "hidden",
      }}>
        {/* Tabs */}
        <div style={{
          display: "flex",
          background: colors.gray100,
          padding: 4,
          margin: 16,
          borderRadius: 14,
          gap: 4,
        }}>
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 10,
                background: tab === t ? "white" : "transparent",
                color: tab === t ? colors.orange : colors.textLight,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
                fontFamily: fonts.body,
                transition: "all 0.2s",
                boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        <div style={{ padding: "4px 20px 24px" }}>
          {tab === "login" ? (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                required
                style={inputStyle}
              />

              {error && (
                <div style={{ fontSize: 12, color: colors.pinkDark, textAlign: "center", fontFamily: fonts.body }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 4,
                  padding: "13px 0",
                  background: loading ? colors.gray300 : colors.orange,
                  border: "none",
                  borderRadius: 12,
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: fonts.body,
                  boxShadow: loading ? "none" : `0 4px 14px ${colors.orange}40`,
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Ingresando..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={fullName}
                onInput={(e) => setFullName((e.target as HTMLInputElement).value)}
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={regEmail}
                onInput={(e) => setRegEmail((e.target as HTMLInputElement).value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={regPassword}
                onInput={(e) => setRegPassword((e.target as HTMLInputElement).value)}
                required
                style={inputStyle}
              />

              {/* Role selector */}
              <div style={{ display: "flex", gap: 8 }}>
                {(["familia", "gestor"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 10,
                      border: `2px solid ${role === r ? colors.orange : colors.gray300}`,
                      background: role === r ? colors.orangeVeryLight : "white",
                      color: role === r ? colors.orange : colors.textLight,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: fonts.body,
                      transition: "all 0.2s",
                    }}
                  >
                    {r === "familia" ? "👨‍👩‍👧 Familia" : "🎯 Gestor"}
                  </button>
                ))}
              </div>

              {error && (
                <div style={{ fontSize: 12, color: colors.pinkDark, textAlign: "center", fontFamily: fonts.body }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 4,
                  padding: "13px 0",
                  background: loading ? colors.gray300 : colors.orange,
                  border: "none",
                  borderRadius: 12,
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: fonts.body,
                  boxShadow: loading ? "none" : `0 4px 14px ${colors.orange}40`,
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
