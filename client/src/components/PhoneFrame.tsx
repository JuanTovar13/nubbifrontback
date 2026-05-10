import { colors} from "../tokens";
import { NubbiLogo } from "./NubbiLogo";


export const TopBar = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent:"center",
    padding: "10px 16px",
    background: "white",
    borderBottom: `1px solid ${colors.gray200}`,
    flexShrink: 0,
  }}>

    <NubbiLogo size={100}/>
  </div>
);

