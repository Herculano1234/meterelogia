import { DailyForecast } from "../../types";
import { getWeatherIcon } from "../../utils/weather";
import { useTheme } from "../../context/ThemeContext";

interface DailyForecastCardProps {
  daily: DailyForecast;
  index: number;
}

export function DailyForecastCard({ daily, index }: DailyForecastCardProps) {
  const { theme } = useTheme();
  const date = new Date(daily.date);
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)",
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: "clamp(12px, 3vw, 16px)",
        textAlign: "center",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 8px 20px rgba(37, 99, 235, 0.15)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: theme.primary, marginBottom: 8, fontWeight: 600 }}>
        {index === 0 ? "Hoje" : index === 1 ? "Amanhã" : dayNames[date.getDay()]}
      </div>
      <div style={{ fontSize: "clamp(24px, 6vw, 36px)", margin: "4px 0" }}>
        {getWeatherIcon(daily.weathercode)}
      </div>
      <div style={{ fontSize: "clamp(12px, 3vw, 16px)", color: theme.primary, marginTop: 8, fontWeight: 700 }}>
        {daily.maxTemp.toFixed(0)}° / {daily.minTemp.toFixed(0)}°
      </div>
      <div style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: theme.primary, marginTop: 4 }}>
        🌧 {daily.precipSum.toFixed(1)}mm
      </div>
    </div>
  );
}
