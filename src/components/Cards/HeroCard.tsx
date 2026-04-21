import { Location } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { getLightningRisk } from "../../utils/weather";

interface HeroCardProps {
  weather: any;
  selectedMunicipality: Location;
  onReload: () => void;
}

export function HeroCard({ weather, selectedMunicipality, onReload }: HeroCardProps) {
  const { theme } = useTheme();
  
  if (!weather) return null;

  const cape = Math.round(weather.cape || 0);
  const risk = getLightningRisk(weather.cape || 0, weather.weathercode || 0);
  const temp = Math.round(weather.temperature || 0);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        padding: "clamp(20px, 5vw, 40px)",
        marginBottom: 32,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        color: theme.textPrimary,
        transition: "all 0.3s ease",
      }}
    >
      {/* Header com cidade e data */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(18px, 5vw, 28px)",
              fontWeight: 700,
              color: theme.textPrimary,
              letterSpacing: 0.5,
            }}
          >
            {selectedMunicipality.name}
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "clamp(11px, 2vw, 14px)",
              color: theme.textSecondary,
            }}
          >
            {new Date().toLocaleDateString("pt-AO", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={onReload}
          style={{
            background: "rgba(37, 99, 235, 0.15)",
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: "8px 16px",
            color: theme.primary,
            cursor: "pointer",
            fontSize: "clamp(12px, 2vw, 14px)",
            fontWeight: 500,
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "rgba(37, 99, 235, 0.25)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "rgba(37, 99, 235, 0.15)";
          }}
        >
          🔄 Atualizar
        </button>
      </div>

      {/* ⚡ BLOCO PRINCIPAL: Status de Descargas com CAPE em Destaque ⚡ */}
      <div
        style={{
          background: `linear-gradient(135deg, rgba(${risk.color === '#ff1744' ? '255,23,68' : risk.color === '#ff6d00' ? '255,109,0' : risk.color === '#ffd600' ? '255,214,0' : '34,197,94'},0.15) 0%, rgba(${risk.color === '#ff1744' ? '255,23,68' : risk.color === '#ff6d00' ? '255,109,0' : risk.color === '#ffd600' ? '255,214,0' : '34,197,94'},0.05) 100%)`,
          border: `2px solid ${risk.color}`,
          borderRadius: 20,
          padding: "clamp(24px, 5vw, 40px)",
          marginBottom: 32,
          textAlign: "center",
          animation: risk.score >= 75 ? "pulse-alert 2s ease-in-out infinite" : "none",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
        
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "clamp(12px, 2vw, 14px)",
            color: theme.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Energia Potencial de Convecção
        </p>

        <div
          style={{
            fontSize: "clamp(48px, 15vw, 96px)",
            fontWeight: 900,
            color: risk.color,
            margin: "8px 0",
            lineHeight: 1,
            textShadow: `0 0 20px ${risk.color}33`,
          }}
        >
          {cape}
        </div>

        <p
          style={{
            margin: "16px 0 0 0",
            fontSize: "clamp(14px, 2.5vw, 18px)",
            fontWeight: 700,
            color: risk.color,
          }}
        >
          {risk.level}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 12,
            fontSize: "clamp(11px, 2vw, 13px)",
            color: theme.textSecondary,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: risk.color,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span>Risco de Descarga: {risk.score}%</span>
        </div>
      </div>

      {/* Grid de Métricas Secundárias */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Temperatura", value: `${temp}°C`, icon: "🌡️" },
          { label: "Humidade", value: `${weather.relative_humidity_2m || 0}%`, icon: "💧" },
          { label: "Vento", value: `${Math.round(weather.wind_speed_10m || 0)} km/h`, icon: "💨" },
          { label: "Precipitação", value: `${weather.precipitation || 0} mm`, icon: "🌧️" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "rgba(148, 163, 184, 0.1)",
              backdropFilter: "blur(10px)",
              border: `1px solid rgba(148, 163, 184, 0.2)`,
              borderRadius: 12,
              padding: "12px 8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontSize: "clamp(10px, 1.2vw, 11px)", color: "rgba(203, 213, 225, 0.6)" }}>
              {item.label}
            </div>
            <div style={{ fontSize: "clamp(13px, 1.8vw, 16px)", fontWeight: 600, marginTop: 4 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-alert {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 23, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(255, 23, 68, 0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
