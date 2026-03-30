import { ESP32Status } from "../../types";
import { TabButton } from "../Common/TabButton";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: "realtime" | "forecast" | "esp32") => void;
  esp32: ESP32Status;
}

export function Header({ activeTab, onTabChange, esp32 }: HeaderProps) {
  return (
    <header
      style={{
        marginBottom: 28,
        borderBottom: "1px solid rgba(100,150,200,0.3)",
        paddingBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "linear-gradient(135deg, #FFB74D, #81C784)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            boxShadow: "0 4px 15px rgba(255,183,77,0.3)",
          }}
        >
          ☁️
        </div>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(18px,4vw,26px)",
              fontWeight: 700,
              letterSpacing: 2,
              color: "#2196F3",
              textTransform: "uppercase",
            }}
          >
            Sistema de Monitoramento
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#1976D2",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Descargas Atmosféricas · Angola · Open-Meteo API
          </p>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#1976D2" }}>⏱ {new Date().toLocaleString("pt-AO")}</div>
          <div
            style={{
              fontSize: 11,
              color: esp32.connected ? "#2E7D32" : "#C62828",
              marginTop: 2,
            }}
          >
            ● ESP32: {esp32.connected ? `ONLINE @ ${esp32.ip}` : "OFFLINE"}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
        {[
          { id: "realtime" as const, label: "⚡ Tempo Real", icon: "📡" },
          { id: "forecast" as const, label: "🌍 Previsão Global", icon: "🛰️" },
          { id: "esp32" as const, label: "📡 ESP32 Control", icon: "🔌" },
        ].map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </header>
  );
}
