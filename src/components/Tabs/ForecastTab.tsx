import { GlobalAlert } from "../../types";
import { AlertCard } from "../Cards/AlertCard";
import { Loading } from "../Common/Loading";
import { GLOBAL_HOTSPOTS } from "../../constants/hotspots";

interface ForecastTabProps {
  alerts: GlobalAlert[];
  loadingAlerts: boolean;
  onReload: () => void;
}

export function ForecastTab({ alerts, loadingAlerts, onReload }: ForecastTabProps) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              color: "#1976D2",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            🌍 Previsão de Catástrofes Globais
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "#5B7C99",
            }}
          >
            Dados em tempo real via Open-Meteo · Análise de CAPE, WMO Weather Codes, temperatura extrema
          </p>
        </div>
        <button
          onClick={onReload}
          disabled={loadingAlerts}
          style={{
            padding: "8px 16px",
            background: "rgba(33,150,243,0.08)",
            border: "1px solid #2196F3",
            borderRadius: 8,
            color: "#1976D2",
            fontFamily: "inherit",
            fontSize: 12,
            cursor: "pointer",
            letterSpacing: 1,
            opacity: loadingAlerts ? 0.6 : 1,
          }}
        >
          {loadingAlerts ? "⏳ Carregando..." : "↻ Atualizar Alertas"}
        </button>
      </div>

      {loadingAlerts && alerts.length === 0 && (
        <Loading message={`VARRENDO ${GLOBAL_HOTSPOTS.length} PONTOS GLOBAIS...`} />
      )}

      {/* Legend */}
      {alerts.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { sev: "extreme", color: "#ff1744", label: "Extremo" },
            { sev: "high", color: "#ff6d00", label: "Alto" },
            { sev: "medium", color: "#ffd600", label: "Moderado" },
            { sev: "low", color: "#00e676", label: "Baixo" },
          ].map((s) => (
            <div key={s.sev} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: s.color,
                }}
              />
              <span style={{ color: "#0288D1" }}>{s.label}</span>
            </div>
          ))}
          <span style={{ fontSize: 11, color: "#5B7C99", marginLeft: "auto" }}>
            {alerts.length} alertas detectados
          </span>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))",
          gap: 14,
        }}
      >
        {alerts.map((alert, i) => (
          <AlertCard key={i} alert={alert} />
        ))}
      </div>

      {alerts.length === 0 && !loadingAlerts && (
        <div style={{ textAlign: "center", padding: 40, color: "#5B7C99" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
          <div>Nenhuma anomalia significativa detectada nos pontos monitorados.</div>
          <div style={{ fontSize: 11, marginTop: 6 }}>Clique em "Atualizar Alertas" para nova análise.</div>
        </div>
      )}

      {/* Info box */}
      <div
        style={{
          marginTop: 24,
          background: "rgba(33,150,243,0.06)",
          border: "1px solid rgba(33,150,243,0.15)",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h4
          style={{
            margin: "0 0 8px",
            fontSize: 12,
            color: "#1976D2",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          ℹ️ Sobre os Indicadores
        </h4>
        <p style={{ margin: 0, fontSize: 12, color: "#5B7C99", lineHeight: 1.7 }}>
          <b style={{ color: "#0288D1" }}>CAPE (Convective Available Potential Energy)</b>: Energia disponível para
          convecção. Valores acima de 1500 J/kg indicam risco alto de trovoadas. Os dados são obtidos em tempo real
          via <b style={{ color: "#1976D2" }}>Open-Meteo API</b> (gratuita, sem chave API) usando modelos NOAA GFS,
          DWD ICON e ECMWF IFS. Atualização automática a cada hora.
        </p>
      </div>
    </div>
  );
}
