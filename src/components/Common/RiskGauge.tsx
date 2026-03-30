import React from "react";

interface RiskGaugeProps {
  icon: string;
  location: string;
  province: string;
  level: string;
  color: string;
  score: number;
  weatherLabel: string;
  cape: number;
  onAlert: () => void;
  isLoading: boolean;
}

export function RiskGauge({
  icon,
  location,
  province,
  level,
  color,
  score,
  weatherLabel,
  cape,
  onAlert,
  isLoading,
}: RiskGaugeProps) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}18, rgba(240,247,255,0.8))`,
        border: `2px solid ${color}`,
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 20,
        boxShadow: `0 4px 20px ${color}25`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontSize: 48 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 11,
            color: "#1976D2",
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Risco de Relâmpago · {location}, {province}
        </div>
        <div style={{ fontSize: "clamp(24px,5vw,36px)", fontWeight: 700, color, letterSpacing: 2 }}>
          {level}
        </div>
        <div style={{ fontSize: 13, color: "#0288D1", marginTop: 2 }}>
          {weatherLabel} · CAPE: {Math.round(cape)} J/kg
        </div>
      </div>
      <div style={{ width: "100%", marginTop: 8 }}>
        <div style={{ height: 6, background: "rgba(100,150,200,0.15)", borderRadius: 4, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${score}%`,
              background: `linear-gradient(90deg, #4CAF50, ${color})`,
              borderRadius: 4,
              transition: "width 1s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#1976D2",
            marginTop: 4,
          }}
        >
          <span>Mínimo</span>
          <span>Baixo</span>
          <span>Moderado</span>
          <span>Alto</span>
          <span>Extremo</span>
        </div>
      </div>
      {score >= 45 && (
        <button
          onClick={onAlert}
          disabled={isLoading}
          style={{
            padding: "10px 18px",
            background: `${color}22`,
            border: `1px solid ${color}`,
            borderRadius: 8,
            color,
            fontFamily: "inherit",
            fontSize: 12,
            cursor: "pointer",
            letterSpacing: 1,
            whiteSpace: "nowrap",
          }}
        >
          {isLoading ? "⏳ Enviando..." : "📡 Alertar ESP32"}
        </button>
      )}
    </div>
  );
}
