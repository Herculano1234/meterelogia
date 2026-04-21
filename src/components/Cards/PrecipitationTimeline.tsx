import { useMemo } from "react";
import { HourlyForecast } from "../../types";
import { useTheme } from "../../context/ThemeContext";

interface PrecipitationTimelineProps {
  forecast: HourlyForecast[];
}

export function PrecipitationTimeline({ forecast }: PrecipitationTimelineProps) {
  const { theme } = useTheme();

  // Get next 60 minutes of data (grouped hourly if needed)
  const timelineData = useMemo(() => {
    return forecast.slice(0, 12).map((item) => ({
      time: new Date(item.time).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" }),
      precipitation: item.precipitation,
      probPercent: Math.min(100, Math.round((item.precipitation || 0) * 50 + (item.precipProb || 0))),
    }));
  }, [forecast]);

  const maxPrecip = Math.max(...timelineData.map((d) => d.probPercent), 1);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: "24px",
        marginBottom: 24,
      }}
    >
      <h3
        style={{
          margin: "0 0 20px 0",
          fontSize: "clamp(14px, 2vw, 16px)",
          fontWeight: 600,
          color: theme.textPrimary,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        🌧️ Precipitação (Próximas 12 Horas)
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 8,
          height: "120px",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          borderRadius: 12,
          padding: "12px 8px",
        }}
      >
        {timelineData.map((item, idx) => {
          const heightPercent = (item.probPercent / maxPrecip) * 100;
          const barColor = 
            item.probPercent > 70 ? "#ff6d00" :
            item.probPercent > 40 ? "#ffd600" :
            item.probPercent > 10 ? "#00e676" :
            "#64b5f6";

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${heightPercent}%`,
                  background: `linear-gradient(180deg, ${barColor} 0%, ${barColor}99 100%)`,
                  borderRadius: "4px 4px 0 0",
                  minHeight: heightPercent > 5 ? 4 : 2,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  boxShadow: `0 0 10px ${barColor}44`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 0 20px ${barColor}99`;
                  el.style.filter = "brightness(1.2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 0 10px ${barColor}44`;
                  el.style.filter = "brightness(1)";
                }}
              />
              <span
                style={{
                  fontSize: "clamp(9px, 1vw, 11px)",
                  color: theme.textSecondary,
                  fontWeight: 500,
                }}
              >
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
          fontSize: "clamp(10px, 1.2vw, 12px)",
          color: theme.textSecondary,
        }}
      >
        <span>0%</span>
        <span>Probabilidade/Intensidade</span>
        <span>100%</span>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
