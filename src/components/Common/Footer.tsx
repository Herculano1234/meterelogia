import { useTheme } from "../../context/ThemeContext";

export function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer style={{
      padding: "40px 20px",
      textAlign: "center",
      background: "transparent",
      color: theme.textTertiary,
      transition: "all 0.3s ease"
    }}>
      <div style={{ 
        maxWidth: "600px", margin: "0 auto", 
        borderTop: `1px solid ${theme.border}`,
        paddingTop: "20px" 
      }}>
        <p style={{ fontSize: "clamp(11px, 1.5vw, 14px)", margin: 0, color: theme.textSecondary }}>🌍 Monitor Atmosférico Angola v2.0</p>
        <p style={{ fontSize: "clamp(9px, 1vw, 12px)", marginTop: 8, color: theme.textTertiary }}>© 2026 Herculano PAP • Luanda</p>
      </div>
    </footer>
  );
}