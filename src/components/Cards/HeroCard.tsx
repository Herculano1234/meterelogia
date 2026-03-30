import React, { useState } from "react";
import { Location } from "../../types";
import { useTheme } from "../../context/ThemeContext";

interface HeroCardProps {
  weather: any;
  selectedMunicipality: Location;
  onReload: () => void;
}

export function HeroCard({ weather, selectedMunicipality, onReload }: HeroCardProps) {
  const { theme } = useTheme();
  
  if (!weather) return null;

  const temp = Math.round(weather.temperature || 0);
  const tempMax = Math.round(weather.temperature_2m_max || 0);
  const tempMin = Math.round(weather.temperature_2m_min || 0);

  // Get weather emoji based on code
  const getWeatherEmoji = (code: number) => {
    if (code === 0 || code === 1) return "☀️";
    if (code === 2 || code === 3) return "⛅";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 80 && code <= 82) return "🌧️";
    if (code >= 85 && code <= 86) return "❄️";
    if (code >= 80 && code <= 99) return "⛈️";
    return "🌤️";
  };

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

      {/* Conteúdo Principal - Temperatura */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        {/* Temperatura Grande */}
        <div>
          <div
            style={{
              fontSize: "clamp(48px, 15vw, 96px)",
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {temp}°
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 12,
              fontSize: "clamp(12px, 2vw, 16px)",
              color: theme.textSecondary,
            }}
          >
            <span>🔥 Máx: {tempMax}°</span>
            <span>❄️ Mín: {tempMin}°</span>
          </div>
        </div>

        {/* Ícone Grande 3D */}
        <div
          style={{
            fontSize: "clamp(80px, 20vw, 150px)",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 10px 30px rgba(59, 130, 246, 0.4))",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          {getWeatherEmoji(weather.weathercode)}
        </div>
      </div>

      {/* Dados Adicionais */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 16,
          paddingTop: 24,
          borderTop: "1px solid rgba(59, 130, 246, 0.2)",
        }}
      >
        {[
          { label: "Pressão", value: `${Math.round(weather.pressure_msl || 0)} mb`, icon: "📊" },
          { label: "Humidade", value: `${weather.relative_humidity_2m || 0}%`, icon: "💧" },
          { label: "Vento", value: `${Math.round(weather.wind_speed_10m || 0)} km/h`, icon: "💨" },
          { label: "Precipitação", value: `${weather.precipitation || 0} mm`, icon: "🌧️" },
        ].map((item, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontSize: "clamp(11px, 1.5vw, 12px)", color: "rgba(203, 213, 225, 0.6)" }}>
              {item.label}
            </div>
            <div style={{ fontSize: "clamp(13px, 2vw, 16px)", fontWeight: 600, marginTop: 4 }}>
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
      `}</style>
    </div>
  );
}
