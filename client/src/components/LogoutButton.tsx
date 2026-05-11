import { colors, fonts } from "../tokens"
import { useAuth } from "../providers/AuthProvider";

export const LogoutButton = () =>{
    const { logout } = useAuth();

    return(
        <button
                    onClick={logout}
                    style={{
                      marginTop: 8,
                      width: "80%",
                      padding: "13px 0",
                      background: colors.blue,
                      
                      borderRadius: 12,
                      color: colors.white,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: fonts.body,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8
                    }}
                  >
                    Cerrar sesión
                  </button>
    )
}