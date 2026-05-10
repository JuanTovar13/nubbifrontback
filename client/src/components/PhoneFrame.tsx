import { colors, fonts } from "../tokens";
import { NubbiLogo } from "./NubbiLogo";


export const TopBar = ({
  onBack,
  title,
}: {
  onBack?: () => void;
  title?: string;
}) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    background: "white",
    borderBottom: `1px solid ${colors.gray200}`,
    flexShrink: 0,
  }}>
    {onBack && (
      <button onClick={onBack} style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 22,
        color: colors.gray700,
        marginRight: 8,
        padding: 0,
        lineHeight: 1,
      }}>
        ‹
      </button>
    )}
    <NubbiLogo />
    {title && (
      <span style={{
        marginLeft: "auto",
        fontSize: 13,
        fontWeight: 700,
        color: colors.gray700,
        fontFamily: fonts.body,
      }}>
        {title}
      </span>
    )}
  </div>
);

