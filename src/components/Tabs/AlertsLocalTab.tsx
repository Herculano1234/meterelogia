import React, { useState } from "react";
import { LocalAlert } from "../../types";

interface AlertsLocalTabProps {
  alerts: LocalAlert[];
  loading: boolean;
  error: string;
}

export function AlertsLocalTab({ alerts, loading, error }: AlertsLocalTabProps) {
  const [selectedAlert, setSelectedAlert] = useState<LocalAlert | null>(null);

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "#ef4444";
      case "high":
        return "#f97316";
      case "medium":
        return "#eab308";
      case "low":
        return "#22c55e";
      default:
        return "#60a5fa";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "⚠️ EXTREMO";
      case "high":
        return "🔴 ALTO";
      case "medium":
        return "🟡 MÉDIO";
      case "low":
        return "🟢 BAIXO";
      default:
        return "❓ DESCONHECIDO";
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case "lightning":
        return "⚡";
      case "thunder":
        return "💥";
      case "rain":
        return "🌧️";
      case "extreme_heat":
        return "🔥";
      default:
        return "📍";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          color: "#cbd5e1",
        }}
      >
        ⏳ Carregando alertas...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        paddingBottom: "100px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#f1f5f9",
            marginBottom: "8px",
          }}
        >
          🔔 Alertas Locais
        </h1>
        <p style={{ color: "#cbd5e1", fontSize: "14px" }}>
          Alertas recebidos de dispositivos ESP32 nas suas zonas
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            color: "#fca5a5",
            marginBottom: "20px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {alerts.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            borderRadius: "12px",
            border: "1px dashed rgba(148, 163, 184, 0.2)",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>☀️</div>
          <h3 style={{ color: "#cbd5e1", marginBottom: "4px" }}>
            Sem alertas no momento
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Todas as zonas monitoradas estão em situação normal
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              style={{
                padding: "16px",
                backgroundColor: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(20px)",
                border: `2px solid ${getAlertColor(alert.severity)}`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: `0 0 20px ${getAlertColor(alert.severity)}40`,
                transform: selectedAlert?.id === alert.id ? "scale(1.02)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = `0 0 30px ${getAlertColor(alert.severity)}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  selectedAlert?.id === alert.id ? "scale(1.02)" : "scale(1)";
                e.currentTarget.style.boxShadow = `0 0 20px ${getAlertColor(
                  alert.severity
                )}40`;
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                <div>
                  <h3
                    style={{
                      color: "#f1f5f9",
                      fontSize: "18px",
                      fontWeight: "600",
                      margin: "0 0 4px 0",
                    }}
                  >
                    {getTypeEmoji(alert.type)} {alert.zone}
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
                    {new Date(alert.timestamp).toLocaleString("pt-PT")}
                  </p>
                </div>
                <span
                  style={{
                    padding: "4px 8px",
                    backgroundColor: getAlertColor(alert.severity),
                    color: "#fff",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {getSeverityLabel(alert.severity)}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
                }}
              >
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0" }}>
                    ⚡ CAPE
                  </p>
                  <p style={{ color: "#fbbf24", fontSize: "16px", fontWeight: "600", margin: 0 }}>
                    {alert.cape.toFixed(0)} J/kg
                  </p>
                </div>

                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0" }}>
                    🌡️ Temperatura
                  </p>
                  <p style={{ color: "#f87171", fontSize: "16px", fontWeight: "600", margin: 0 }}>
                    {alert.temperature.toFixed(1)}°C
                  </p>
                </div>

                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0" }}>
                    🌧️ Precipitação
                  </p>
                  <p style={{ color: "#60a5fa", fontSize: "16px", fontWeight: "600", margin: 0 }}>
                    {alert.precipitation.toFixed(1)} mm
                  </p>
                </div>

                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0" }}>
                    ⚡ Descarga
                  </p>
                  <p
                    style={{
                      color: alert.hasLightning ? "#ef4444" : "#22c55e",
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: 0,
                    }}
                  >
                    {alert.hasLightning ? "🔴 SIM" : "🟢 NÃO"}
                  </p>
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
                    📡 Antena
                  </p>
                  <p style={{ color: "#cbd5e1", fontSize: "12px", margin: 0 }}>
                    {alert.antennaReading}/4095
                  </p>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: "rgba(148, 163, 184, 0.2)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(alert.antennaReading / 4095) * 100}%`,
                      backgroundColor:
                        alert.antennaReading > 2000
                          ? "#ef4444"
                          : alert.antennaReading > 1000
                          ? "#f97316"
                          : "#22c55e",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              <p style={{ color: "#64748b", fontSize: "11px", margin: "12px 0 0 0", paddingTop: "12px", borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
                ESP32 ID: {alert.esp32Id}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedAlert && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: "20px",
          }}
          onClick={() => setSelectedAlert(null)}
        >
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "24px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                color: "#f1f5f9",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "20px",
              }}
            >
              {getTypeEmoji(selectedAlert.type)} {selectedAlert.zone}
              <span
                style={{
                  marginLeft: "auto",
                  padding: "4px 8px",
                  backgroundColor: getAlertColor(selectedAlert.severity),
                  color: "#fff",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {getSeverityLabel(selectedAlert.severity)}
              </span>
            </h2>

            <p style={{ color: "#94a3b8", margin: "0 0 16px 0" }}>
              {selectedAlert.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
              }}
            >
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0" }}>
                  ⚡ CAPE
                </p>
                <p style={{ color: "#fbbf24", fontSize: "18px", fontWeight: "600", margin: 0 }}>
                  {selectedAlert.cape.toFixed(0)} J/kg
                </p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0" }}>
                  🌡️ Temperatura
                </p>
                <p style={{ color: "#f87171", fontSize: "18px", fontWeight: "600", margin: 0 }}>
                  {selectedAlert.temperature.toFixed(1)}°C
                </p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0" }}>
                  🌧️ Precipitação
                </p>
                <p style={{ color: "#60a5fa", fontSize: "18px", fontWeight: "600", margin: 0 }}>
                  {selectedAlert.precipitation.toFixed(1)} mm
                </p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0" }}>
                  📡 Antena
                </p>
                <p style={{ color: "#cbd5e1", fontSize: "18px", fontWeight: "600", margin: 0 }}>
                  {selectedAlert.antennaReading}/4095
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 4px 0" }}>
                Descarga Elétrica
              </p>
              <p
                style={{
                  color: selectedAlert.hasLightning ? "#ef4444" : "#22c55e",
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {selectedAlert.hasLightning
                  ? "🔴 SIM - Descarga detectada!"
                  : "🟢 NÃO - Nenhuma descarga"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "rgba(148, 163, 184, 0.2)",
                  color: "#cbd5e1",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(148, 163, 184, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(148, 163, 184, 0.2)";
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
