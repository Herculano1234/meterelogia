import { Location, WeatherData } from "../../types";
import { ANGOLA_LOCATIONS } from "../../constants/locations";
import { getWeatherLabel, getWeatherIcon, getLightningRisk } from "../../utils/weather";
import { MetricCard } from "../Cards/MetricCard";
import { HourlyForecastCard } from "../Cards/HourlyForecastCard";
import { DailyForecastCard } from "../Cards/DailyForecastCard";
import { HeroCard } from "../Cards/HeroCard";
import { PrecipitationTimeline } from "../Cards/PrecipitationTimeline";
import { SensorPanel } from "../Cards/SensorPanel";
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
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <style>{`
          @media (min-width: 640px) {
            .location-selector-grid {
              grid-template-columns: 1fr 1fr auto;
              gap: 12px;
            }
          }
        `}</style>
        <div className="location-selector-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, width: "100%" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label
              style={{
                fontSize: "clamp(10px, 1.5vw, 12px)",
                color: "#60a5fa",
                letterSpacing: 2,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
                fontWeight: 600,
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
                padding: "clamp(8px, 2vw, 12px) 12px",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: 12,
                color: "#60a5fa",
                fontFamily: "inherit",
                fontSize: "clamp(12px, 2vw, 14px)",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s",
              }}
            >
              {ANGOLA_LOCATIONS.map((p) => (
                <option key={p.province} value={p.province}>
                  {p.province}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label
              style={{
                fontSize: "clamp(10px, 1.5vw, 12px)",
                color: "#60a5fa",
                letterSpacing: 2,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
                fontWeight: 600,
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
                padding: "clamp(8px, 2vw, 12px) 12px",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: 12,
                color: "#60a5fa",
                fontFamily: "inherit",
                fontSize: "clamp(12px, 2vw, 14px)",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s",
              }}
            >
              {municipalities.map((m) => (
                <option key={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={onReload}
              disabled={loadingWeather}
              style={{
                padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.1))",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: 12,
                color: "#60a5fa",
                fontFamily: "inherit",
                fontSize: "clamp(12px, 2vw, 14px)",
                cursor: loadingWeather ? "not-allowed" : "pointer",
                letterSpacing: 1,
                opacity: loadingWeather ? 0.6 : 1,
                transition: "all 0.3s",
                fontWeight: 600,
                backdropFilter: "blur(10px)",
                whiteSpace: "nowrap",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!loadingWeather) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.2))";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.1))";
              }}
            >
              {loadingWeather ? "⏳ Carregando..." : "↻ Atualizar"}
            </button>
          </div>
        </div>
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
          {/* HERO CARD - Nova estrutura com CAPE em destaque */}
          <HeroCard weather={weather} selectedMunicipality={selectedMunicipality} onReload={onReload} />

          {/* PRECIPITATION TIMELINE */}
          {weather.forecast && weather.forecast.length > 0 && (
            <PrecipitationTimeline forecast={weather.forecast} />
          )}

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

          {/* SENSOR PANEL - Grid de sensores */}
          <SensorPanel weather={weather} />

          {/* METRICS GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 12,
              marginBottom: 20,
              marginTop: 32,
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
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(94, 202, 248, 0.75)",
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
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(101, 209, 255, 0.9)",
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
