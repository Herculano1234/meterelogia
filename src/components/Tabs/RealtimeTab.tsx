import { useState, useEffect } from "react";
import { Location, WeatherData } from "../../types";
import { ANGOLA_LOCATIONS } from "../../constants/locations";
import { getWeatherLabel, getWeatherIcon, getLightningRisk } from "../../utils/weather";
import { MetricCard } from "../Cards/MetricCard";
import { HourlyForecastCard } from "../Cards/HourlyForecastCard";
import { DailyForecastCard } from "../Cards/DailyForecastCard";
import { RiskGauge } from "../Common/RiskGauge";
import { Loading } from "../Common/Loading";

interface RealtimeTabProps {
  weather: WeatherData | null;
  loadingWeather: boolean;
  weatherError: string;
  selectedMunicipality: Location;
  selectedProvince: string;
  onLocationChange: (province: string, municipality: Location) => void;
  onReload: () => void;
  onSendAlert: (cape: number, wcode: number) => void;
  sendingAlert: boolean;
}

export function RealtimeTab({
  weather,
  loadingWeather,
  weatherError,
  selectedMunicipality,
  selectedProvince,
  onLocationChange,
  onReload,
  onSendAlert,
  sendingAlert,
}: RealtimeTabProps) {
  const municipalities = ANGOLA_LOCATIONS.find((p) => p.province === selectedProvince)?.municipalities ?? [];
  const risk = weather ? getLightningRisk(weather.cape, weather.weathercode) : null;

  return (
    <div>
      {/* Location Selector */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1, minWidth: 180 }}>
          <label
            style={{
              fontSize: 11,
              color: "#1976D2",
              letterSpacing: 2,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            Província
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => {
              const prov = ANGOLA_LOCATIONS.find((p) => p.province === e.target.value);
              if (prov) onLocationChange(e.target.value, prov.municipalities[0]);
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "rgba(33,150,243,0.08)",
              border: "1px solid rgba(33,150,243,0.3)",
              borderRadius: 8,
              color: "#0D47A1",
              fontFamily: "inherit",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {ANGOLA_LOCATIONS.map((p) => (
              <option key={p.province} value={p.province}>
                {p.province}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label
            style={{
              fontSize: 11,
              color: "#1976D2",
              letterSpacing: 2,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            Município
          </label>
          <select
            value={selectedMunicipality.name}
            onChange={(e) => {
              const m = municipalities.find((m) => m.name === e.target.value);
              if (m) onLocationChange(selectedProvince, m);
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "rgba(33,150,243,0.08)",
              border: "1px solid rgba(33,150,243,0.3)",
              borderRadius: 8,
              color: "#0D47A1",
              fontFamily: "inherit",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {municipalities.map((m) => (
              <option key={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onReload}
          disabled={loadingWeather}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #2196F322, #81C78422)",
            border: "1px solid #2196F3",
            borderRadius: 8,
            color: "#1976D2",
            fontFamily: "inherit",
            fontSize: 13,
            cursor: "pointer",
            letterSpacing: 1,
            opacity: loadingWeather ? 0.6 : 1,
          }}
        >
          {loadingWeather ? "⏳ Carregando..." : "↻ Atualizar"}
        </button>
      </div>

      {weatherError && (
        <div
          style={{
            background: "rgba(211,47,47,0.08)",
            border: "1px solid #C62828",
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
            color: "#D32F2F",
          }}
        >
          ⚠️ {weatherError}
        </div>
      )}

      {weather && (
        <>
          {/* LIGHTNING RISK GAUGE */}
          <RiskGauge
            icon={getWeatherIcon(weather.weathercode)}
            location={selectedMunicipality.name}
            province={selectedProvince}
            level={risk!.level}
            color={risk!.color}
            score={risk!.score}
            weatherLabel={getWeatherLabel(weather.weathercode)}
            cape={weather.cape}
            onAlert={() => onSendAlert(weather.cape, weather.weathercode)}
            isLoading={sendingAlert}
          />

          {/* METRICS GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "Temperatura",
                value: `${weather.temperature.toFixed(1)}°C`,
                icon: "🌡️",
                sub: `Sensação: ${weather.apparent_temperature.toFixed(1)}°C`,
              },
              {
                label: "Humidade",
                value: `${weather.humidity}%`,
                icon: "💧",
                sub: "Humidade relativa",
              },
              {
                label: "Vento",
                value: `${weather.windspeed.toFixed(1)} km/h`,
                icon: "💨",
                sub: "Velocidade do vento",
              },
              {
                label: "Precipitação",
                value: `${weather.precipitation.toFixed(1)} mm`,
                icon: "🌧️",
                sub: `Prob: ${weather.precipitation_probability}%`,
              },
              {
                label: "Nebulosidade",
                value: `${weather.cloudcover}%`,
                icon: "☁️",
                sub: "Cobertura de nuvens",
              },
              {
                label: "Pressão",
                value: `${weather.surface_pressure.toFixed(0)} hPa`,
                icon: "🔵",
                sub: "Pressão superficial",
              },
              {
                label: "CAPE",
                value: `${Math.round(weather.cape)} J/kg`,
                icon: "⚡",
                sub: "Energia convectiva",
              },
              {
                label: "Índice Lift.",
                value: `${weather.lifted_index?.toFixed(1) ?? "N/A"}`,
                icon: "📊",
                sub: "Lifted Index",
              },
              {
                label: "UV Index",
                value: `${weather.uv_index ?? "N/A"}`,
                icon: "☀️",
                sub: "Índice ultravioleta",
              },
              {
                label: "Visibilidade",
                value: `${((weather.visibility ?? 0) / 1000).toFixed(1)} km`,
                icon: "👁️",
                sub: "Visibilidade",
              },
            ].map((m) => (
              <MetricCard key={m.label} icon={m.icon} label={m.label} value={m.value} sub={m.sub} />
            ))}
          </div>

          {/* 24H FORECAST */}
          <div
            style={{
              background: "rgba(0,20,50,0.8)",
              border: "1px solid rgba(0,180,255,0.2)",
              borderRadius: 14,
              padding: 18,
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                margin: "0 0 14px",
                fontSize: 13,
                color: "#4fc3f7",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              ⏱ Previsão Próximas 24 Horas
            </h3>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
              {weather.forecast.slice(0, 24).map((h, i) => (
                <HourlyForecastCard key={i} hour={h} />
              ))}
            </div>
          </div>

          {/* 7-DAY DAILY FORECAST */}
          <div
            style={{
              background: "rgba(0,20,50,0.8)",
              border: "1px solid rgba(0,180,255,0.2)",
              borderRadius: 14,
              padding: 18,
            }}
          >
            <h3
              style={{
                margin: "0 0 14px",
                fontSize: 13,
                color: "#4fc3f7",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              📅 Previsão 7 Dias
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))",
                gap: 10,
              }}
            >
              {weather.daily.map((d, i) => (
                <DailyForecastCard key={i} daily={d} index={i} />
              ))}
            </div>
          </div>
        </>
      )}

      {loadingWeather && !weather && <Loading message="OBTENDO DADOS METEOROLÓGICOS..." />}
    </div>
  );
}
