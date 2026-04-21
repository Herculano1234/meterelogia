import React, { useState } from "react";
import { ESP32Device, EmailAlert } from "../../types";

interface SettingsTabProps {
  devices: ESP32Device[];
  emailAlerts: EmailAlert[];
  onSaveDevice: (device: ESP32Device) => void;
  onSaveEmailAlert: (emailAlert: EmailAlert) => void;
  onDeleteDevice: (deviceId: string) => void;
  onDeleteEmailAlert: (alertId: string) => void;
}

export function SettingsTab({
  devices,
  emailAlerts,
  onSaveDevice,
  onSaveEmailAlert,
  onDeleteDevice,
  onDeleteEmailAlert,
}: SettingsTabProps) {
  const [activeTab, setActiveTab] = useState<"devices" | "emails">("devices");
  const [newDeviceId, setNewDeviceId] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceZone, setNewDeviceZone] = useState("Huambo");
  const [newEmailZone, setNewEmailZone] = useState("Huambo");
  const [newEmailList, setNewEmailList] = useState("");

  const zones = ["Huambo", "Luanda", "Bengo", "Kwanza Norte"];

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#f1f5f9" }}>⚙️ Configurações</h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={() => setActiveTab("devices")}
          style={{
            padding: "8px 16px",
            backgroundColor: activeTab === "devices" ? "rgba(0, 212, 255, 0.2)" : "transparent",
            border: activeTab === "devices" ? "1px solid #00d4ff" : "1px solid rgba(148, 163, 184, 0.2)",
            color: activeTab === "devices" ? "#00d4ff" : "#cbd5e1",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          📡 Dispositivos ESP32
        </button>
        <button
          onClick={() => setActiveTab("emails")}
          style={{
            padding: "8px 16px",
            backgroundColor: activeTab === "emails" ? "rgba(0, 212, 255, 0.2)" : "transparent",
            border: activeTab === "emails" ? "1px solid #00d4ff" : "1px solid rgba(148, 163, 184, 0.2)",
            color: activeTab === "emails" ? "#00d4ff" : "#cbd5e1",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          📧 Alertas por Email
        </button>
      </div>

      {activeTab === "devices" && (
        <div>
          <div style={{ backgroundColor: "rgba(30, 41, 59, 0.6)", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
            <h3 style={{ color: "#f1f5f9", marginBottom: "16px" }}>Adicionar Novo ESP32</h3>
            <div style={{ display: "grid", gap: "12px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="ID do ESP32 (ex: 0001)"
                value={newDeviceId}
                onChange={(e) => setNewDeviceId(e.target.value)}
                style={{ padding: "10px", backgroundColor: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.3)", color: "#f1f5f9", borderRadius: "8px" }}
              />
              <input
                type="text"
                placeholder="Nome do dispositivo"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                style={{ padding: "10px", backgroundColor: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.3)", color: "#f1f5f9", borderRadius: "8px" }}
              />
              <select
                value={newDeviceZone}
                onChange={(e) => setNewDeviceZone(e.target.value)}
                style={{ padding: "10px", backgroundColor: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.3)", color: "#f1f5f9", borderRadius: "8px" }}
              >
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                if (newDeviceId && newDeviceName) {
                  onSaveDevice({
                    id: newDeviceId,
                    name: newDeviceName,
                    zone: newDeviceZone,
                    connected: false,
                    lastConnection: new Date().toISOString(),
                    buzzerActive: false,
                    ledActive: false,
                  });
                  setNewDeviceId("");
                  setNewDeviceName("");
                }
              }}
              style={{ padding: "10px 20px", backgroundColor: "#00d4ff", color: "#000", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
            >
              ➕ Adicionar
            </button>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {devices.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Nenhum ESP32 vinculado</p>
            ) : (
              devices.map((device) => (
                <div key={device.id} style={{ padding: "16px", backgroundColor: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "12px", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h4 style={{ color: "#f1f5f9", margin: 0 }}>📡 {device.name}</h4>
                    <p style={{ color: "#94a3b8", fontSize: "12px", margin: "4px 0" }}>ID: {device.id} | Zona: {device.zone}</p>
                    <p style={{ color: device.connected ? "#22c55e" : "#ef4444", fontSize: "12px", margin: 0 }}>
                      {device.connected ? "🟢 Conectado" : "🔴 Desconectado"}
                    </p>
                  </div>
                  <button onClick={() => onDeleteDevice(device.id)} style={{ padding: "8px 16px", backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", cursor: "pointer" }}>
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "emails" && (
        <div>
          <div style={{ backgroundColor: "rgba(30, 41, 59, 0.6)", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
            <h3 style={{ color: "#f1f5f9", marginBottom: "16px" }}>Adicionar Emails por Zona</h3>
            <select
              value={newEmailZone}
              onChange={(e) => setNewEmailZone(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "12px", backgroundColor: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.3)", color: "#f1f5f9", borderRadius: "8px" }}
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Emails separados por vírgula"
              value={newEmailList}
              onChange={(e) => setNewEmailList(e.target.value)}
              style={{ width: "100%", padding: "10px", backgroundColor: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(148, 163, 184, 0.3)", color: "#f1f5f9", borderRadius: "8px", minHeight: "60px", marginBottom: "12px" }}
            />
            <button
              onClick={() => {
                if (newEmailZone && newEmailList) {
                  onSaveEmailAlert({
                    id: `${newEmailZone}-${Date.now()}`,
                    zone: newEmailZone,
                    emails: newEmailList.split(",").map((e) => e.trim()),
                    enableCapeAlerts: true,
                    enableLightningAlerts: true,
                    enableRainAlerts: true,
                  });
                  setNewEmailList("");
                }
              }}
              style={{ padding: "10px 20px", backgroundColor: "#00d4ff", color: "#000", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
            >
              ➕ Adicionar
            </button>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {emailAlerts.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Nenhum alerta configurado</p>
            ) : (
              emailAlerts.map((alert) => (
                <div key={alert.id} style={{ padding: "16px", backgroundColor: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <h4 style={{ color: "#f1f5f9", margin: 0 }}>📧 {alert.zone}</h4>
                    <button onClick={() => onDeleteEmailAlert(alert.id)} style={{ padding: "8px 16px", backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                      🗑️
                    </button>
                  </div>
                  <div>
                    {alert.emails.map((email, i) => (
                      <p key={i} style={{ color: "#cbd5e1", fontSize: "12px", margin: "4px 0", fontFamily: "monospace" }}>
                        • {email}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
