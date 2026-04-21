import { useTheme } from "../../context/ThemeContext";
import { ESP32Status } from "../../types";
import { Cloud } from "lucide-react";

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
        background: "#ffffff",
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
            width: 50, height: 50, borderRadius: "12px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            boxShadow: "0 8px 16px rgba(59, 130, 246, 0.15)"
          }}>
            <Cloud size={32} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 700, color: theme.textPrimary }}>ONZAJI</h1>
            <p style={{ margin: 0, fontSize: "clamp(10px, 1.5vw, 12px)", color: theme.textSecondary }}>Monitoramento de Tempestades em Angola</p>
          </div>
        </div>

        {/* TABS ESTILO PÍLULA */}
        <div style={{ background: "#f3f4f6", padding: 4, borderRadius: 8, display: "flex", gap: 4 }}>
          {["realtime", "forecast"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab as any)}
              style={{
                padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer",
                background: activeTab === tab ? "#3b82f6" : "transparent",
                color: activeTab === tab ? "#ffffff" : theme.textSecondary,
                fontWeight: 600, transition: "0.3s", fontSize: "clamp(11px, 2vw, 14px)"
              }}
            >
              {tab === "realtime" ? "Live" : "Previsão"}
            </button>
          ))}
        </div>

        {/* STATUS ESP32 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f0fdf4", padding: "8px 14px", borderRadius: 8, border: "1px solid #dcfce7" }}>
          <div style={{ 
            width: 8, height: 8, borderRadius: "50%", 
            background: esp32.connected ? "#10b981" : "#ef4444",
            animation: esp32.connected ? "pulse-dot 2s infinite" : "none"
          }} />
          <span style={{ fontSize: "clamp(10px, 1.5vw, 12px)", fontWeight: "600", color: esp32.connected ? "#10b981" : "#ef4444" }}>{esp32.connected ? "Conectado" : "Offline"}</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </header>
  );
}