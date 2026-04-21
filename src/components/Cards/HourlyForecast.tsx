import React from "react";

interface HourlyForecastProps {
  weather: any;
}

export function HourlyForecast({ weather }: HourlyForecastProps) {
  if (!weather || !weather.hourly) return null;

  const hours = weather.hourly.time.slice(0, 12).map((time: string, idx: number) => ({
    time: new Date(time).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" }),
    temp: Math.round(weather.hourly.temperature_2m[idx]),
    code: weather.hourly.weather_code[idx],
  }));

  const getEmoji = (code: number) => {
    if (code === 0 || code === 1) return "☀️";
    if (code === 2 || code === 3) return "⛅";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 80 && code <= 82) return "🌧️";
    if (code >= 85 && code <= 99) return "⛈️";
    return "🌤️";
  };

  return (
    <div
      style={{
        marginBottom: 32,
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "clamp(14px, 3vw, 18px)",
          fontWeight: 700,
          color: "#e2e8f0",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        ⏰ Previsão Horária
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {hours.map((hour, idx) => (
          <div
            key={idx}
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: 16,
              padding: "12px",
              textAlign: "center",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 12, color: "rgba(203, 213, 225, 0.7)", marginBottom: 8 }}>
              {hour.time}
            </div>
            <div style={{ fontSize: "clamp(20px, 4vw, 32px)", marginBottom: 8 }}>
              {getEmoji(hour.code)}
            </div>
            <div style={{ fontSize: "clamp(13px, 2vw, 16px)", fontWeight: 600, color: "#60a5fa" }}>
              {hour.temp}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
