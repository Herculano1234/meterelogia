import { ESP32Status } from "../../types";

interface ESP32TabProps {
  esp32: ESP32Status;
  ipInput: string;
  setIpInput: (ip: string) => void;
  sending: boolean;
  log: string[];
  onConnect: () => void;
  onSendAlert: (cape: number, wcode: number, auto: boolean) => void;
}

export function ESP32Tab({
  esp32,
  ipInput,
  setIpInput,
  sending,
  log,
  onConnect,
  onSendAlert,
}: ESP32TabProps) {
  return (
    <div>
      <h2
        style={{
          margin: "0 0 6px",
          fontSize: 16,
          color: "#1976D2",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        📡 Controlo ESP32
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 12, color: "#5B7C99" }}>
        Envie alertas para o ESP32 via Wi-Fi. O ESP32 aciona o buzzer de forma diferente consoante o nível de risco.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Connection */}
        <div
          style={{
            background: "rgba(33,150,243,0.06)",
            border: "1px solid rgba(33,150,243,0.2)",
            borderRadius: 14,
            padding: 20,
            gridColumn: "1 / -1",
          }}
        >
          <h3
            style={{
              margin: "0 0 14px",
              fontSize: 13,
              color: "#1976D2",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            🔌 Configuração do Dispositivo
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "#1976D2",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                IP do ESP32
              </label>
              <input
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="192.168.1.100"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "rgba(33,150,243,0.08)",
                  border: "1px solid rgba(33,150,243,0.3)",
                  borderRadius: 8,
                  color: "#0D47A1",
                  fontFamily: "inherit",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              onClick={onConnect}
              style={{
                padding: "10px 20px",
                background: "rgba(33,150,243,0.1)",
                border: "1px solid #2196F3",
                borderRadius: 8,
                color: "#1976D2",
                fontFamily: "inherit",
                fontSize: 12,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              🔗 Conectar
            </button>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: esp32.connected ? "rgba(46,125,50,0.1)" : "rgba(198,40,40,0.1)",
                border: `1px solid ${esp32.connected ? "#2E7D32" : "#C62828"}`,
                color: esp32.connected ? "#2E7D32" : "#C62828",
                fontSize: 12,
              }}
            >
              {esp32.connected ? `✅ ONLINE · ${esp32.ip}` : "❌ OFFLINE"}
            </div>
          </div>
        </div>

        {/* Manual alarm triggers */}
        <div
          style={{
            background: "rgba(33,150,243,0.06)",
            border: "1px solid rgba(33,150,243,0.2)",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <h3
            style={{
              margin: "0 0 14px",
              fontSize: 13,
              color: "#1976D2",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            🔔 Acionar Alarme
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                label: "⚠️ Atenção (PI)",
                desc: "Risco baixo → buzzer emite um PI curto",
                cape: 200,
                wcode: 61,
              },
              {
                label: "🟠 Alerta (PI PI)",
                desc: "Risco moderado → dois PIs",
                cape: 800,
                wcode: 80,
              },
              {
                label: "🔴 Perigo (PIII PIII)",
                desc: "Risco alto → PIs longos",
                cape: 2000,
                wcode: 95,
              },
              {
                label: "🆘 Extremo (PIIIII)",
                desc: "Risco extremo → PI muito longo contínuo",
                cape: 4000,
                wcode: 99,
              },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => onSendAlert(btn.cape, btn.wcode, false)}
                disabled={sending}
                style={{
                  padding: "10px 14px",
                  background: "rgba(33,150,243,0.08)",
                  border: "1px solid rgba(33,150,243,0.3)",
                  borderRadius: 8,
                  color: "#0D47A1",
                  fontFamily: "inherit",
                  fontSize: 12,
                  cursor: "pointer",
                  textAlign: "left",
                  opacity: sending ? 0.6 : 1,
                }}
              >
                <div style={{ fontWeight: 700 }}>{btn.label}</div>
                <div style={{ fontSize: 10, color: "#5B7C99", marginTop: 2 }}>{btn.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ESP32 Code */}
        <div
          style={{
            background: "rgba(33,150,243,0.06)",
            border: "1px solid rgba(33,150,243,0.2)",
            borderRadius: 14,
            padding: 20,
            overflow: "hidden",
          }}
        >
          <h3
            style={{
              margin: "0 0 14px",
              fontSize: 13,
              color: "#1976D2",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            💾 Código ESP32 (Arduino)
          </h3>
          <pre
            style={{
              margin: 0,
              fontSize: 10,
              color: "#0D47A1",
              overflowX: "auto",
              background: "rgba(33,150,243,0.04)",
              padding: 12,
              borderRadius: 8,
              lineHeight: 1.6,
              maxHeight: 260,
            }}
          >
            {`#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "SEU_WIFI";
const char* password = "SUA_SENHA";
const int BUZZER_PIN = 23;

WebServer server(80);

void handleAlert() {
  String level = server.arg("level");
  int risco = level.toInt();
  
  // Risco >= 75: PIII PIII (perigo)
  // Risco < 75:  PI (atenção)
  if (risco >= 75) {
    tone(BUZZER_PIN, 1000, 800);
    delay(1000);
    tone(BUZZER_PIN, 1000, 800);
    delay(1000);
  } else {
    tone(BUZZER_PIN, 800, 300);
    delay(500);
  }
  server.send(200, "text/plain", "OK");
}

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
    delay(500);
  server.on("/alert", handleAlert);
  server.begin();
}

void loop() {
  server.handleClient();
}`}
          </pre>
        </div>
      </div>

      {/* Log */}
      <div
        style={{
          background: "rgba(33,150,243,0.05)",
          border: "1px solid rgba(33,150,243,0.2)",
          borderRadius: 14,
          padding: 18,
        }}
      >
        <h3
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            color: "#1976D2",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          📋 Log de Comunicação
        </h3>
        <div style={{ height: 200, overflowY: "auto", fontFamily: "monospace" }}>
          {log.length === 0 && (
            <div style={{ color: "#5B7C99", fontSize: 12, fontStyle: "italic" }}>
              Nenhuma atividade ainda...
            </div>
          )}
          {log.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                padding: "3px 0",
                borderBottom: "1px solid rgba(33,150,243,0.1)",
                color: line.includes("✅")
                  ? "#2E7D32"
                  : line.includes("❌")
                  ? "#C62828"
                  : "#0288D1",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
