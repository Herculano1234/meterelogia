import { WeatherData, HourlyForecast, DailyForecast, GlobalAlert } from "../types";
import { GLOBAL_HOTSPOTS } from "../constants/hotspots";
import { getLightningRisk } from "../utils/weather";

// ─── FETCH WEATHER DATA ──────────────────────────────────────────────────────
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,cloud_cover,visibility,uv_index&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,cloud_cover,cape,lifted_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=7&timezone=auto`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao obter dados meteorológicos");
  
  const data = await res.json();
  const c = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  // Build hourly next 24h
  const forecast: HourlyForecast[] = [];
  for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
    forecast.push({
      time: hourly.time[i],
      temperature: hourly.temperature_2m[i],
      precipitation: hourly.precipitation[i] ?? 0,
      precipProb: hourly.precipitation_probability[i] ?? 0,
      cape: hourly.cape[i] ?? 0,
      cloudcover: hourly.cloud_cover[i] ?? 0,
      weathercode: hourly.weather_code[i] ?? 0,
    });
  }

  const dailyForecasts: DailyForecast[] = daily.time.map((t: string, i: number) => ({
    date: t,
    maxTemp: daily.temperature_2m_max[i],
    minTemp: daily.temperature_2m_min[i],
    precipSum: daily.precipitation_sum[i],
    weathercode: daily.weather_code[i],
  }));

  return {
    temperature: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    windspeed: c.wind_speed_10m,
    precipitation: c.precipitation,
    cloudcover: c.cloud_cover,
    weathercode: c.weather_code,
    apparent_temperature: c.apparent_temperature,
    surface_pressure: c.surface_pressure,
    visibility: c.visibility,
    uv_index: c.uv_index,
    precipitation_probability: hourly.precipitation_probability[0] ?? 0,
    cape: hourly.cape[0] ?? 0,
    lifted_index: hourly.lifted_index[0] ?? 0,
    forecast,
    daily: dailyForecasts,
  };
}

// ─── FETCH GLOBAL ALERTS ────────────────────────────────────────────────────
export async function fetchGlobalAlerts(): Promise<GlobalAlert[]> {
  const alerts: GlobalAlert[] = [];

  // Fetch weather for global hotspots in parallel
  const results = await Promise.allSettled(
    GLOBAL_HOTSPOTS.map(async (loc) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,weather_code,precipitation&hourly=cape,precipitation_probability,weather_code&forecast_days=3&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) return null;
      return { loc, data: await res.json() };
    })
  );

  for (const result of results) {
    if (result.status !== "fulfilled" || !result.value) continue;
    const { loc, data } = result.value;
    const capeMax = Math.max(...(data.hourly.cape?.slice(0, 72) ?? [0]).filter((v: number) => v != null));
    const precipMax = Math.max(...(data.hourly.precipitation_probability?.slice(0, 72) ?? [0]).filter((v: number) => v != null));
    const wcodes: number[] = data.hourly.weather_code?.slice(0, 72) ?? [];
    const hasThunder = wcodes.some((w: number) => w >= 95);
    const temp = data.current.temperature_2m ?? 0;

    // Lightning alert
    if (capeMax > 500 || hasThunder) {
      const severity = capeMax > 3000 || hasThunder ? (capeMax > 2000 ? "extreme" : "high") : capeMax > 1000 ? "medium" : "low";
      alerts.push({
        location: `${loc.name}`,
        lat: loc.lat,
        lon: loc.lon,
        type: "lightning",
        severity: severity as GlobalAlert["severity"],
        value: Math.round(capeMax),
        unit: "J/kg CAPE",
        description: hasThunder ? "Trovoada ativa detectada" : `Energia convectiva elevada: ${Math.round(capeMax)} J/kg`,
        cape: capeMax,
      });
    }

    // Extreme heat alert
    if (temp > 40) {
      alerts.push({
        location: loc.name,
        lat: loc.lat,
        lon: loc.lon,
        type: "extreme_heat",
        severity: temp > 45 ? "extreme" : "high",
        value: Math.round(temp),
        unit: "°C",
        description: `Calor extremo: ${Math.round(temp)}°C`,
      });
    }
  }

  return alerts.sort((a, b) => {
    const order = { extreme: 0, high: 1, medium: 2, low: 3 } as Record<string, number>;
    return order[a.severity] - order[b.severity];
  });
}
