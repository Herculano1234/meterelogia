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
export function RiskGauge({ icon, location, province, level, color, score, weatherLabel, cape, onAlert, isLoading }: RiskGaugeProps) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color} 0%, #1e293b 100%)`,
      borderRadius: "40px",
      padding: "32px",
      color: "white",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      position: "relative",
      overflow: "hidden",
      marginBottom: "30px"
    }}>
      {/* Círculo de brilho decorativo no fundo do card */}
      <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "150px", height: "150px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }} />
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: "32px", margin: 0, fontWeight: 800 }}>{location}</h2>
            <p style={{ opacity: 0.8, fontSize: "14px", letterSpacing: 1 }}>{province.toUpperCase()}</p>
          </div>
          <div style={{ fontSize: "64px" }}>{icon}</div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <div style={{ fontSize: "48px", fontWeight: 900, lineHeight: 1 }}>{level}</div>
          <p style={{ margin: "8px 0", opacity: 0.9 }}>{weatherLabel} • CAPE: {Math.round(cape)}</p>
        </div>

        {/* Barra de Progresso Estilizada */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ height: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ height: "100%", width: `${score}%`, background: "#fff", borderRadius: 10, transition: "1s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 8, fontWeight: 600 }}>
            <span>SEGURO</span>
            <span>CRÍTICO</span>
          </div>
        </div>

        {score >= 45 && (
          <button 
            onClick={onAlert}
            style={{
              marginTop: "24px", width: "100%", padding: "14px", borderRadius: "16px",
              border: "none", background: "white", color: "#000", fontWeight: "bold",
              cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
            }}
          >
            {isLoading ? "ENVIANDO SINAL..." : "DISPARAR ALERTA ESP32"}
          </button>
        )}
      </div>
    </div>
  );
}
