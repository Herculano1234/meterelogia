import { useTheme } from "../../context/ThemeContext";
import { ESP32Status } from "../../types";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: "realtime" | "forecast" | "esp32") => void;
  esp32: ESP32Status;
}
export function Header({ activeTab, onTabChange, esp32 }: HeaderProps) {
  const { theme } = useTheme();
  
  return (
    <header
      style={{
        background: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${theme.border}`,
        padding: "20px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 50, height: 50, borderRadius: "18px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)"
          }}>⚡</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 800, color: theme.textPrimary }}>Monitor Pro</h1>
            <p style={{ margin: 0, fontSize: "clamp(10px, 1.5vw, 12px)", color: theme.textSecondary }}>Angola • Tempo Real</p>
          </div>
        </div>

        {/* TABS ESTILO PÍLULA */}
        <div style={{ background: "rgba(0,0,0,0.08)", padding: 4, borderRadius: 20, display: "flex", gap: 4 }}>
          {["realtime", "forecast"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab as any)}
              style={{
                padding: "8px 20px", borderRadius: 16, border: "none", cursor: "pointer",
                background: activeTab === tab ? "rgba(37, 99, 235, 0.2)" : "transparent",
                color: activeTab === tab ? theme.textPrimary : theme.textSecondary,
                fontWeight: 600, transition: "0.3s", fontSize: "clamp(11px, 2vw, 14px)"
              }}
            >
              {tab === "realtime" ? "Live" : "Previsão"}
            </button>
          ))}
        </div>

        {/* STATUS ESP32 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(37, 99, 235, 0.1)", padding: "8px 16px", borderRadius: 12 }}>
          <div style={{ 
            width: 8, height: 8, borderRadius: "50%", 
            background: esp32.connected ? "#10b981" : "#ef4444",
            boxShadow: esp32.connected ? "0 0 10px #10b981" : "none" 
          }} />
          <span style={{ fontSize: "clamp(10px, 1.5vw, 12px)", fontWeight: "bold", color: theme.textPrimary }}>{esp32.connected ? "ESP32 ON" : "OFFLINE"}</span>
        </div>
      </div>
    </header>
  );
}