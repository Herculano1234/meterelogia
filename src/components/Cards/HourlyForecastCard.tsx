import { HourlyForecast } from "../../types";
import { getWeatherIcon, getLightningRisk } from "../../utils/weather";
import { useTheme } from "../../context/ThemeContext";

interface HourlyForecastCardProps {
  hour: HourlyForecast;
}

export function HourlyForecastCard({ hour }: HourlyForecastCardProps) {
  const { theme } = useTheme();
  const risk = getLightningRisk(hour.cape, hour.weathercode);
  const hour_num = new Date(hour.time).getHours();

  return (
    <div
      style={{
        flex: "0 0 clamp(70px, 12vw, 100px)",
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)",
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        padding: "clamp(8px, 2vw, 14px)",
        textAlign: "center",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "clamp(100px, 25vw, 140px)",
        backdropFilter: "blur(10px)",
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
      <div style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: theme.primary, fontWeight: 600 }}>
        {hour_num.toString().padStart(2, "0")}:00
      </div>
      <div style={{ fontSize: "clamp(20px, 5vw, 32px)", margin: "4px 0" }}>
        {getWeatherIcon(hour.weathercode)}
      </div>
      <div style={{ fontSize: "clamp(13px, 3vw, 18px)", fontWeight: 700, color: theme.primary }}>
        {hour.temperature.toFixed(0)}°
      </div>
      <div style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: risk.color, marginTop: 2 }}>
        {risk.level.slice(0, 3)}
      </div>
      <div style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: theme.primary }}>{hour.precipProb}%</div>
    </div>
  );
}
