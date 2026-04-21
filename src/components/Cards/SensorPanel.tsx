import { useTheme } from "../../context/ThemeContext";
import { WeatherData } from "../../types";

interface SensorPanelProps {
  weather: WeatherData | null;
}

export function SensorPanel({ weather }: SensorPanelProps) {
  const { theme } = useTheme();

  if (!weather) return null;

  const sensors = [
    {
      label: "Índice UV",
      value: Math.round(weather.uv_index || 0),
      icon: "☀️",
      color: "#ffd600",
      scale: 11,
    },
    {
      label: "Visibilidade",
      value: `${Math.round((weather.visibility || 0) / 1000)} km`,
      icon: "👁️",
      color: "#00b0ff",
      scale: 10,
    },
    {
      label: "Pressão",
      value: `${Math.round(weather.surface_pressure || 0)} mb`,
      icon: "📊",
      color: "#00e676",
      scale: 1050,
    },
    {
      label: "Qualidade do Ar",
      value: "Bom",
      icon: "🌬️",
      color: "#00e676",
      scale: 100,
    },
  ];

  return (
    <div>
      <h3
        style={{
          margin: "32px 0 20px 0",
          fontSize: "clamp(14px, 2vw, 16px)",
          fontWeight: 600,
          color: theme.textPrimary,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        📡 Painel de Sensores
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
        }}
      >
        {sensors.map((sensor, idx) => (
          <div
            key={idx}
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)",
              backdropFilter: "blur(20px)",
              border: `2px solid rgba(${sensor.color === "#ffd600" ? "255,214,0" : sensor.color === "#00b0ff" ? "0,176,255" : "0,230,118"},0.3)`,
              borderRadius: 16,
              padding: "20px",
              textAlign: "center",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-4px)";
              el.style.boxShadow = `0 8px 20px ${sensor.color}44`;
              el.style.borderColor = sensor.color;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
              el.style.borderColor = `rgba(${sensor.color === "#ffd600" ? "255,214,0" : sensor.color === "#00b0ff" ? "0,176,255" : "0,230,118"},0.3)`;
            }}
          >
            {/* Background bar para escala */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "4px",
                width: `${(parseFloat(String(sensor.value).split(" ")[0]) / sensor.scale) * 100}%`,
                background: `linear-gradient(90deg, ${sensor.color}33 0%, ${sensor.color} 100%)`,
                transition: "width 0.3s ease",
              }}
            />

            <div style={{ fontSize: 28, marginBottom: 8 }}>{sensor.icon}</div>

            <div
              style={{
                fontSize: "clamp(12px, 1.5vw, 13px)",
                color: theme.textSecondary,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {sensor.label}
            </div>

            <div
              style={{
                fontSize: "clamp(18px, 3vw, 24px)",
                fontWeight: 700,
                color: sensor.color,
                margin: "8px 0",
              }}
            >
              {sensor.value}
            </div>

            <div
              style={{
                fontSize: "10px",
                color: theme.textTertiary,
                marginTop: 8,
              }}
            >
              {sensor.label === "Índice UV" && "0 (Baixo) - 11+ (Alto)"}
              {sensor.label === "Visibilidade" && "Muito boa visibilidade"}
              {sensor.label === "Pressão" && "Normal"}
              {sensor.label === "Qualidade do Ar" && "Sem poluição"}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-sensor-panel] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
