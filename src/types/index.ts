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

// ─── LOCAL ALERT TYPES (ESP32) ───────────────────────────────────────────────
export interface LocalAlert {
  id: string;
  esp32Id: string;
  zone: string;                    // Zona (ex: "Huambo")
  timestamp: string;
  type: "lightning" | "rain" | "thunder" | "extreme_heat";
  cape: number;                    // J/kg
  precipitation: number;           // mm
  temperature: number;             // °C
  antennaReading: number;          // Leitura analógica 0-4095
  hasLightning: boolean;           // True se detecção de descarga
  severity: "low" | "medium" | "high" | "extreme";
  description: string;
}

// ─── ESP32 DEVICE TYPES ─────────────────────────────────────────────────────
export interface ESP32Device {
  id: string;                      // ID único do ESP32 (ex: "0001")
  name: string;
  zone: string;                    // Zona associada (Huambo, Luanda, etc)
  ip?: string;
  connected: boolean;
  lastConnection: string;          // ISO timestamp
  buzzerActive: boolean;
  ledActive: boolean;
}

// ─── CONFIGURATION SETTINGS ─────────────────────────────────────────────────
export interface ConfigSettings {
  esp32Devices: ESP32Device[];
  emailAlerts: EmailAlert[];
  thresholds: AlertThresholds;
}

export interface EmailAlert {
  id: string;
  zone: string;
  emails: string[];               // Lista de emails para a zona
  enableCapeAlerts: boolean;
  enableLightningAlerts: boolean;
  enableRainAlerts: boolean;
}

export interface AlertThresholds {
  capeThreshold: number;          // Ex: 500 J/kg
  antennaThreshold: number;       // Ex: 2000 (leitura analógica)
  temperatureThreshold: number;   // Ex: 40°C
  precipitationThreshold: number; // Ex: 10mm
}
