import { RiskLevel } from "../types";

// ─── WEATHER CODE LABELS ─────────────────────────────────────────────────────
export function getWeatherLabel(code: number): string {
  const map: Record<number, string> = {
    0: "Céu Limpo",
    1: "Maioritariamente Limpo",
    2: "Parcialmente Nublado",
    3: "Nublado",
    45: "Nevoeiro",
    48: "Nevoeiro com Geada",
    51: "Chuvisco Leve",
    53: "Chuvisco Moderado",
    55: "Chuvisco Intenso",
    61: "Chuva Leve",
    63: "Chuva Moderada",
    65: "Chuva Intensa",
    71: "Neve Leve",
    73: "Neve Moderada",
    75: "Neve Intensa",
    80: "Aguaceiros Leves",
    81: "Aguaceiros Moderados",
    82: "Aguaceiros Intensos",
    95: "⚡ Trovoada",
    96: "⚡ Trovoada com Granizo",
    99: "⚡ Trovoada Intensa com Granizo",
  };
  return map[code] ?? "Condição Desconhecida";
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 75) return "❄️";
  if (code <= 82) return "🌩️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

export function getLightningRisk(cape: number, weathercode: number): RiskLevel {
  if (weathercode >= 95 || cape > 3000)
    return { level: "EXTREMO", color: "#ff1744", score: 100 };
  if (cape > 1500 || weathercode >= 80)
    return { level: "ALTO", color: "#ff6d00", score: 75 };
  if (cape > 500 || weathercode >= 61)
    return { level: "MODERADO", color: "#ffd600", score: 45 };
  if (cape > 100)
    return { level: "BAIXO", color: "#00e676", score: 20 };
  return { level: "MÍNIMO", color: "#00b0ff", score: 5 };
}

export const WEATHER_LABEL_MAP: Record<number, string> = {
  0: "Céu Limpo",
  1: "Maioritariamente Limpo",
  2: "Parcialmente Nublado",
  3: "Nublado",
  45: "Nevoeiro",
  48: "Nevoeiro com Geada",
  51: "Chuvisco Leve",
  53: "Chuvisco Moderado",
  55: "Chuvisco Intenso",
  61: "Chuva Leve",
  63: "Chuva Moderada",
  65: "Chuva Intensa",
  71: "Neve Leve",
  73: "Neve Moderada",
  75: "Neve Intensa",
  80: "Aguaceiros Leves",
  81: "Aguaceiros Moderados",
  82: "Aguaceiros Intensos",
  95: "⚡ Trovoada",
  96: "⚡ Trovoada com Granizo",
  99: "⚡ Trovoada Intensa com Granizo",
};
