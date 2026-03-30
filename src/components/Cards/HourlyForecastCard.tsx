import { HourlyForecast } from "../../types";
import { getWeatherIcon, getLightningRisk } from "../../utils/weather";

interface HourlyForecastCardProps {
  hour: HourlyForecast;
}

export function HourlyForecastCard({ hour }: HourlyForecastCardProps) {
  const risk = getLightningRisk(hour.cape, hour.weathercode);
  const hour_num = new Date(hour.time).getHours();

  return (
    <div
      style={{
        flex: "0 0 80px",
        background: `${risk.color}12`,
        border: `1px solid ${risk.color}40`,
        borderRadius: 10,
        padding: "10px 6px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 11, color: "#0288D1" }}>
        {hour_num.toString().padStart(2, "0")}:00
      </div>
      <div style={{ fontSize: 18, margin: "4px 0" }}>
        {getWeatherIcon(hour.weathercode)}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0D47A1" }}>
        {hour.temperature.toFixed(0)}°
      </div>
      <div style={{ fontSize: 10, color: risk.color, marginTop: 2 }}>
        {risk.level.slice(0, 3)}
      </div>
      <div style={{ fontSize: 10, color: "#1976D2" }}>{hour.precipProb}%</div>
    </div>
  );
}
