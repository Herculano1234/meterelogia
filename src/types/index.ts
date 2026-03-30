// ─── LOCATION TYPES ─────────────────────────────────────────────────────────
export interface Location {
  name: string;
  lat: number;
  lon: number;
  admin1?: string;
  country?: string;
  country_code?: string;
}

// ─── WEATHER TYPES ──────────────────────────────────────────────────────────
export interface WeatherData {
  temperature: number;
  humidity: number;
  windspeed: number;
  precipitation: number;
  cloudcover: number;
  weathercode: number;
  apparent_temperature: number;
  surface_pressure: number;
  visibility: number;
  uv_index: number;
  precipitation_probability: number;
  cape: number;
  lifted_index: number;
  forecast: HourlyForecast[];
  daily: DailyForecast[];
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitation: number;
  precipProb: number;
  cape: number;
  cloudcover: number;
  weathercode: number;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipSum: number;
  weathercode: number;
}

// ─── ALERT TYPES ────────────────────────────────────────────────────────────
export interface GlobalAlert {
  location: string;
  lat: number;
  lon: number;
  type: "lightning" | "earthquake" | "flood" | "extreme_heat" | "cyclone";
  severity: "low" | "medium" | "high" | "extreme";
  value: number;
  unit: string;
  description: string;
  cape?: number;
}

// ─── ESP32 TYPES ────────────────────────────────────────────────────────────
export interface ESP32Status {
  connected: boolean;
  ip: string;
  lastPing: string;
  alarmSent: boolean;
}

// ─── RISK LEVEL TYPES ───────────────────────────────────────────────────────
export interface RiskLevel {
  level: string;
  color: string;
  score: number;
}
