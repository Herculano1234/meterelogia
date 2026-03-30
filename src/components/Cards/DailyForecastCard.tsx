import { DailyForecast } from "../../types";
import { getWeatherIcon } from "../../utils/weather";

interface DailyForecastCardProps {
  daily: DailyForecast;
  index: number;
}

export function DailyForecastCard({ daily, index }: DailyForecastCardProps) {
  const date = new Date(daily.date);
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div
      style={{
        background: "rgba(33,150,243,0.05)",
        border: "1px solid rgba(33,150,243,0.15)",
        borderRadius: 10,
        padding: 12,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 11, color: "#1976D2", marginBottom: 4 }}>
        {index === 0 ? "Hoje" : index === 1 ? "Amanhã" : dayNames[date.getDay()]}
      </div>
      <div style={{ fontSize: 22 }}>{getWeatherIcon(daily.weathercode)}</div>
      <div style={{ fontSize: 13, color: "#0D47A1", marginTop: 4 }}>
        {daily.maxTemp.toFixed(0)}° / {daily.minTemp.toFixed(0)}°
      </div>
      <div style={{ fontSize: 10, color: "#1976D2", marginTop: 2 }}>
        🌧 {daily.precipSum.toFixed(1)}mm
      </div>
    </div>
  );
}
