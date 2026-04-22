import { useState, useEffect, useCallback, useRef } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Location {
  name: string;
  lat: number;
  lon: number;
  admin1?: string;
  country?: string;
  country_code?: string;
}

interface WeatherData {
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

interface HourlyForecast {
  time: string;
  temperature: number;
  precipitation: number;
  precipProb: number;
  cape: number;
  cloudcover: number;
  weathercode: number;
}

interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipSum: number;
  weathercode: number;
}

interface GlobalAlert {
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

interface ESP32Status {
  connected: boolean;
  ip: string;
  lastPing: string;
  alarmSent: boolean;
}

// ─── ANGOLA PROVINCES & MUNICIPALITIES ───────────────────────────────────────
const ANGOLA_LOCATIONS: { province: string; municipalities: Location[] }[] = [
  {
    province: "Luanda",
    municipalities: [
      { name: "Luanda", lat: -8.8368, lon: 13.2343, admin1: "Luanda", country: "Angola" },
      { name: "Viana", lat: -8.9035, lon: 13.3745, admin1: "Luanda", country: "Angola" },
      { name: "Cacuaco", lat: -8.7667, lon: 13.3667, admin1: "Luanda", country: "Angola" },
      { name: "Cazenga", lat: -8.8003, lon: 13.2667, admin1: "Luanda", country: "Angola" },
      { name: "Belas", lat: -8.9167, lon: 13.1667, admin1: "Luanda", country: "Angola" },
    ],
  },
  {
    province: "Huíla",
    municipalities: [
      { name: "Lubango", lat: -14.9177, lon: 13.4921, admin1: "Huíla", country: "Angola" },
      { name: "Matala", lat: -14.7333, lon: 15.0167, admin1: "Huíla", country: "Angola" },
      { name: "Cacula", lat: -14.1, lon: 14.3167, admin1: "Huíla", country: "Angola" },
    ],
  },
  {
    province: "Huambo",
    municipalities: [
      { name: "Huambo", lat: -12.7761, lon: 15.7392, admin1: "Huambo", country: "Angola" },
      { name: "Londuimbali", lat: -12.25, lon: 15.6667, admin1: "Huambo", country: "Angola" },
    ],
  },
  {
    province: "Benguela",
    municipalities: [
      { name: "Benguela", lat: -12.5763, lon: 13.4055, admin1: "Benguela", country: "Angola" },
      { name: "Lobito", lat: -12.3547, lon: 13.5464, admin1: "Benguela", country: "Angola" },
      { name: "Baía Farta", lat: -12.6167, lon: 13.2, admin1: "Benguela", country: "Angola" },
    ],
  },
  {
    province: "Bié",
    municipalities: [
      { name: "Kuito", lat: -12.3833, lon: 16.9333, admin1: "Bié", country: "Angola" },
      { name: "Camacupa", lat: -12.0167, lon: 17.4833, admin1: "Bié", country: "Angola" },
    ],
  },
  {
    province: "Malanje",
    municipalities: [
      { name: "Malanje", lat: -9.5403, lon: 16.3414, admin1: "Malanje", country: "Angola" },
    ],
  },
  {
    province: "Uíge",
    municipalities: [
      { name: "Uíge", lat: -7.6088, lon: 15.0628, admin1: "Uíge", country: "Angola" },
    ],
  },
  {
    province: "Zaire",
    municipalities: [
      { name: "Mbanza Kongo", lat: -6.2667, lon: 14.25, admin1: "Zaire", country: "Angola" },
    ],
  },
  {
    province: "Cabinda",
    municipalities: [
      { name: "Cabinda", lat: -5.55, lon: 12.2, admin1: "Cabinda", country: "Angola" },
    ],
  },
  {
    province: "Kwanza Norte",
    municipalities: [
      { name: "N'dalatando", lat: -9.3, lon: 14.9167, admin1: "Kwanza Norte", country: "Angola" },
    ],
  },
  {
    province: "Kwanza Sul",
    municipalities: [
      { name: "Sumbe", lat: -11.2, lon: 13.8333, admin1: "Kwanza Sul", country: "Angola" },
      { name: "Waku-Kungo", lat: -11.3667, lon: 15.1167, admin1: "Kwanza Sul", country: "Angola" },
    ],
  },
  {
    province: "Cuando Cubango",
    municipalities: [
      { name: "Menongue", lat: -14.6576, lon: 17.6908, admin1: "Cuando Cubango", country: "Angola" },
    ],
  },
  {
    province: "Cunene",
    municipalities: [
      { name: "Ondjiva", lat: -17.0667, lon: 15.7333, admin1: "Cunene", country: "Angola" },
    ],
  },
  {
    province: "Moxico",
    municipalities: [
      { name: "Luena", lat: -11.7833, lon: 19.9167, admin1: "Moxico", country: "Angola" },
    ],
  },
  {
    province: "Lunda Norte",
    municipalities: [
      { name: "Dundo", lat: -7.3733, lon: 20.8297, admin1: "Lunda Norte", country: "Angola" },
    ],
  },
  {
    province: "Lunda Sul",
    municipalities: [
      { name: "Saurimo", lat: -9.6667, lon: 20.3833, admin1: "Lunda Sul", country: "Angola" },
    ],
  },
  {
    province: "Namibe",
    municipalities: [
      { name: "Namibe", lat: -15.1961, lon: 12.1522, admin1: "Namibe", country: "Angola" },
    ],
  },
  {
    province: "Bengo",
    municipalities: [
      { name: "Caxito", lat: -8.5667, lon: 13.6667, admin1: "Bengo", country: "Angola" },
    ],
  },
];

// ─── GLOBAL HOTSPOTS for catastrophe tab ─────────────────────────────────────
const GLOBAL_HOTSPOTS = [
  { name: "Manaus, Brasil", lat: -3.1019, lon: -60.025, region: "Amazônia" },
  { name: "Jakarta, Indonésia", lat: -6.2088, lon: 106.8456, region: "Sudeste Asiático" },
  { name: "Lagos, Nigéria", lat: 6.5244, lon: 3.3792, region: "África Ocidental" },
  { name: "Caracas, Venezuela", lat: 10.4806, lon: -66.9036, region: "América do Sul" },
  { name: "Colombo, Sri Lanka", lat: 6.9271, lon: 79.8612, region: "Ásia do Sul" },
  { name: "Libreville, Gabão", lat: 0.3901, lon: 9.4544, region: "África Central" },
  { name: "Yangon, Myanmar", lat: 16.8661, lon: 96.1951, region: "Sudeste Asiático" },
  { name: "Kinshasa, R.D. Congo", lat: -4.3217, lon: 15.3222, region: "África Central" },
  { name: "Manila, Filipinas", lat: 14.5995, lon: 120.9842, region: "Ásia-Pacífico" },
  { name: "Dhaka, Bangladesh", lat: 23.8103, lon: 90.4125, region: "Ásia do Sul" },
  { name: "Miami, EUA", lat: 25.7617, lon: -80.1918, region: "América do Norte" },
  { name: "Tokio, Japão", lat: 35.6762, lon: 139.6503, region: "Ásia do Leste" },
  { name: "Mumbai, Índia", lat: 19.076, lon: 72.8777, region: "Ásia do Sul" },
  { name: "Ciudad de México", lat: 19.4326, lon: -99.1332, region: "América Central" },
  { name: "São Paulo, Brasil", lat: -23.5505, lon: -46.6333, region: "América do Sul" },
  { name: "Lusaka, Zâmbia", lat: -15.4167, lon: 28.2833, region: "África Austral" },
];

// ─── WEATHER CODE LABELS ─────────────────────────────────────────────────────
function getWeatherLabel(code: number): string {
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

function getWeatherIcon(code: number): string {
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

function getLightningRisk(cape: number, weathercode: number): { level: string; color: string; score: number } {
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

// ─── API CALLS ────────────────────────────────────────────────────────────────
async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,cloud_cover,visibility,uv_index&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,cloud_cover,cape,lifted_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=7&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao obter dados meteorológicos");
  const data = await res.json();

  const c = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  // Build hourly next 24h
  const now = new Date();
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

async function fetchGlobalAlerts(): Promise<GlobalAlert[]> {
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
    const order = { extreme: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function LightningMonitor() {
  const [activeTab, setActiveTab] = useState<"realtime" | "forecast" | "esp32">("realtime");
  const [selectedProvince, setSelectedProvince] = useState("Luanda");
  const [selectedMunicipality, setSelectedMunicipality] = useState<Location>(ANGOLA_LOCATIONS[0].municipalities[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [globalAlerts, setGlobalAlerts] = useState<GlobalAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [esp32, setEsp32] = useState<ESP32Status>({ connected: false, ip: "192.168.1.100", lastPing: "", alarmSent: false });
  const [esp32IpInput, setEsp32IpInput] = useState("192.168.1.100");
  const [sendingESP, setSendingESP] = useState(false);
  const [espLog, setEspLog] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const municipalities = ANGOLA_LOCATIONS.find((p) => p.province === selectedProvince)?.municipalities ?? [];

  const loadWeather = useCallback(async () => {
    setLoadingWeather(true);
    setWeatherError("");
    try {
      const data = await fetchWeather(selectedMunicipality.lat, selectedMunicipality.lon);
      setWeather(data);
      // Auto-alert ESP if high risk
      if (data.cape > 500 || data.weathercode >= 95) {
        sendESP32Alert(data.cape, data.weathercode, true);
      }
    } catch (e: any) {
      setWeatherError(e.message ?? "Erro desconhecido");
    } finally {
      setLoadingWeather(false);
    }
  }, [selectedMunicipality]);

  const loadGlobalAlerts = useCallback(async () => {
    setLoadingAlerts(true);
    try {
      const alerts = await fetchGlobalAlerts();
      setGlobalAlerts(alerts);
    } catch {}
    setLoadingAlerts(false);
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  useEffect(() => {
    if (activeTab === "forecast" && globalAlerts.length === 0) {
      loadGlobalAlerts();
    }
  }, [activeTab]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (activeTab === "realtime") loadWeather();
    }, 300000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeTab, loadWeather]);

  function sendESP32Alert(cape: number, wcode: number, auto = false) {
    const risk = getLightningRisk(cape, wcode);
    const isHigh = risk.score >= 75;
    setSendingESP(true);
    const log = `[${new Date().toLocaleTimeString("pt-AO")}] ${auto ? "AUTO" : "MANUAL"}: Enviando alerta ${risk.level} para ESP32 @ ${esp32IpInput}...`;
    setEspLog((prev) => [log, ...prev.slice(0, 49)]);
    setTimeout(() => {
      const success = Math.random() > 0.15; // simulate network
      const logResult = success
        ? `[${new Date().toLocaleTimeString("pt-AO")}] ✅ ESP32 respondeu! Buzzer: ${isHigh ? "PIII PIII (perigo)" : "PI (atenção)"}`
        : `[${new Date().toLocaleTimeString("pt-AO")}] ❌ ESP32 não respondeu (timeout)`;
      setEspLog((prev) => [logResult, ...prev.slice(0, 49)]);
      setEsp32((prev) => ({ ...prev, connected: success, alarmSent: success, lastPing: new Date().toLocaleTimeString("pt-AO") }));
      setSendingESP(false);
    }, 1500);
  }

  const risk = weather ? getLightningRisk(weather.cape, weather.weathercode) : null;

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: "'Space Mono', 'Courier New', monospace",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 40%, #0a0f1e 100%)",
      minHeight: "100vh",
      color: "#e0f0ff",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated background grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,180,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Lightning bolt decorative */}
      <div style={{ position: "fixed", top: 0, right: 0, width: 400, height: 400, pointerEvents: "none", zIndex: 0, opacity: 0.03, fontSize: 400, lineHeight: 1 }}>⚡</div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {/* HEADER */}
        <header style={{ marginBottom: 28, borderBottom: "1px solid rgba(0,180,255,0.2)", paddingBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "linear-gradient(135deg, #00b0ff, #1de9b6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, boxShadow: "0 0 30px rgba(0,176,255,0.5)",
            }}>⚡</div>
            <div>
              <h1 style={{ margin: 0, fontSize: "clamp(18px,4vw,26px)", fontWeight: 700, letterSpacing: 2, color: "#00e5ff", textTransform: "uppercase" }}>
                Sistema de Monitoramento
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: "#4fc3f7", letterSpacing: 3, textTransform: "uppercase" }}>
                Descargas Atmosféricas · Angola · Open-Meteo API
              </p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#4fc3f7" }}>⏱ {new Date().toLocaleString("pt-AO")}</div>
              <div style={{ fontSize: 11, color: esp32.connected ? "#00e676" : "#ff5252", marginTop: 2 }}>
                ● ESP32: {esp32.connected ? `ONLINE @ ${esp32.ip}` : "OFFLINE"}
              </div>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
            {[
              { id: "realtime", label: "⚡ Tempo Real", icon: "📡" },
              { id: "forecast", label: "🌍 Previsão Global", icon: "🛰️" },
              { id: "esp32", label: "📡 ESP32 Control", icon: "🔌" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  padding: "8px 20px", border: "1px solid",
                  borderColor: activeTab === tab.id ? "#00e5ff" : "rgba(0,180,255,0.3)",
                  borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                  background: activeTab === tab.id ? "rgba(0,229,255,0.12)" : "rgba(255,255,255,0.03)",
                  color: activeTab === tab.id ? "#00e5ff" : "#7ec8e3",
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  transition: "all 0.2s", letterSpacing: 1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* ─── TAB: REALTIME ─────────────────────────────────────────────────── */}
        {activeTab === "realtime" && (
          <div>
            {/* Location Selector */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{ fontSize: 11, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Província</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    const prov = ANGOLA_LOCATIONS.find((p) => p.province === e.target.value);
                    if (prov) setSelectedMunicipality(prov.municipalities[0]);
                  }}
                  style={{
                    width: "100%", padding: "10px 14px", background: "rgba(0,30,60,0.8)",
                    border: "1px solid rgba(0,180,255,0.4)", borderRadius: 8, color: "#e0f0ff",
                    fontFamily: "inherit", fontSize: 14, cursor: "pointer",
                  }}
                >
                  {ANGOLA_LOCATIONS.map((p) => <option key={p.province} value={p.province}>{p.province}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{ fontSize: 11, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Município</label>
                <select
                  value={selectedMunicipality.name}
                  onChange={(e) => {
                    const m = municipalities.find((m) => m.name === e.target.value);
                    if (m) setSelectedMunicipality(m);
                  }}
                  style={{
                    width: "100%", padding: "10px 14px", background: "rgba(0,30,60,0.8)",
                    border: "1px solid rgba(0,180,255,0.4)", borderRadius: 8, color: "#e0f0ff",
                    fontFamily: "inherit", fontSize: 14, cursor: "pointer",
                  }}
                >
                  {municipalities.map((m) => <option key={m.name}>{m.name}</option>)}
                </select>
              </div>
              <button
                onClick={loadWeather}
                disabled={loadingWeather}
                style={{
                  padding: "10px 20px", background: "linear-gradient(135deg, #00b0ff22, #1de9b622)",
                  border: "1px solid #00e5ff", borderRadius: 8, color: "#00e5ff",
                  fontFamily: "inherit", fontSize: 13, cursor: "pointer", letterSpacing: 1,
                  opacity: loadingWeather ? 0.6 : 1,
                }}
              >
                {loadingWeather ? "⏳ Carregando..." : "↻ Atualizar"}
              </button>
            </div>

            {weatherError && (
              <div style={{ background: "rgba(255,23,68,0.1)", border: "1px solid #ff1744", borderRadius: 10, padding: 16, marginBottom: 20, color: "#ff5252" }}>
                ⚠️ {weatherError}
              </div>
            )}

            {weather && (
              <>
                {/* LIGHTNING RISK GAUGE */}
                <div style={{
                  background: `linear-gradient(135deg, ${risk!.color}18, rgba(0,30,60,0.95))`,
                  border: `2px solid ${risk!.color}`,
                  borderRadius: 16, padding: "20px 24px", marginBottom: 20,
                  boxShadow: `0 0 40px ${risk!.color}30`,
                  display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
                }}>
                  <div style={{ fontSize: 48 }}>{getWeatherIcon(weather.weathercode)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#4fc3f7", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
                      Risco de Relâmpago · {selectedMunicipality.name}, {selectedProvince}
                    </div>
                    <div style={{ fontSize: "clamp(24px,5vw,36px)", fontWeight: 700, color: risk!.color, letterSpacing: 2 }}>
                      {risk!.level}
                    </div>
                    <div style={{ fontSize: 13, color: "#7ec8e3", marginTop: 2 }}>
                      {getWeatherLabel(weather.weathercode)} · CAPE: {Math.round(weather.cape)} J/kg
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ width: "100%", marginTop: 8 }}>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${risk!.score}%`,
                        background: `linear-gradient(90deg, #00e676, ${risk!.color})`,
                        borderRadius: 4, transition: "width 1s ease",
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#4fc3f7", marginTop: 4 }}>
                      <span>Mínimo</span><span>Baixo</span><span>Moderado</span><span>Alto</span><span>Extremo</span>
                    </div>
                  </div>
                  {risk!.score >= 45 && (
                    <button
                      onClick={() => sendESP32Alert(weather.cape, weather.weathercode)}
                      disabled={sendingESP}
                      style={{
                        padding: "10px 18px", background: `${risk!.color}22`,
                        border: `1px solid ${risk!.color}`, borderRadius: 8,
                        color: risk!.color, fontFamily: "inherit", fontSize: 12,
                        cursor: "pointer", letterSpacing: 1, whiteSpace: "nowrap",
                      }}
                    >
                      {sendingESP ? "⏳ Enviando..." : "📡 Alertar ESP32"}
                    </button>
                  )}
                </div>

                {/* METRICS GRID */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Temperatura", value: `${weather.temperature.toFixed(1)}°C`, icon: "🌡️", sub: `Sensação: ${weather.apparent_temperature.toFixed(1)}°C` },
                    { label: "Humidade", value: `${weather.humidity}%`, icon: "💧", sub: "Humidade relativa" },
                    { label: "Vento", value: `${weather.windspeed.toFixed(1)} km/h`, icon: "💨", sub: "Velocidade do vento" },
                    { label: "Precipitação", value: `${weather.precipitation.toFixed(1)} mm`, icon: "🌧️", sub: `Prob: ${weather.precipitation_probability}%` },
                    { label: "Nebulosidade", value: `${weather.cloudcover}%`, icon: "☁️", sub: "Cobertura de nuvens" },
                    { label: "Pressão", value: `${weather.surface_pressure.toFixed(0)} hPa`, icon: "🔵", sub: "Pressão superficial" },
                    { label: "CAPE", value: `${Math.round(weather.cape)} J/kg`, icon: "⚡", sub: "Energia convectiva" },
                    { label: "Índice Lift.", value: `${weather.lifted_index?.toFixed(1) ?? "N/A"}`, icon: "📊", sub: "Lifted Index" },
                    { label: "UV Index", value: `${weather.uv_index ?? "N/A"}`, icon: "☀️", sub: "Índice ultravioleta" },
                    { label: "Visibilidade", value: `${((weather.visibility ?? 0) / 1000).toFixed(1)} km`, icon: "👁️", sub: "Visibilidade" },
                  ].map((m) => (
                    <div key={m.label} style={{
                      background: "rgba(0,30,60,0.7)", border: "1px solid rgba(0,180,255,0.2)",
                      borderRadius: 12, padding: "14px 16px",
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
                      <div style={{ fontSize: 11, color: "#4fc3f7", letterSpacing: 1, textTransform: "uppercase" }}>{m.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#00e5ff", margin: "4px 0" }}>{m.value}</div>
                      <div style={{ fontSize: 10, color: "#5b8a99" }}>{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* 24H FORECAST */}
                <div style={{ background: "rgba(0,20,50,0.8)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 14, padding: 18, marginBottom: 20 }}>
                  <h3 style={{ margin: "0 0 14px", fontSize: 13, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase" }}>⏱ Previsão Próximas 24 Horas</h3>
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
                    {weather.forecast.slice(0, 24).map((h, i) => {
                      const r = getLightningRisk(h.cape, h.weathercode);
                      const hour = new Date(h.time).getHours();
                      return (
                        <div key={i} style={{
                          flex: "0 0 80px", background: `${r.color}12`,
                          border: `1px solid ${r.color}40`, borderRadius: 10,
                          padding: "10px 6px", textAlign: "center",
                        }}>
                          <div style={{ fontSize: 11, color: "#7ec8e3" }}>{hour.toString().padStart(2, "0")}:00</div>
                          <div style={{ fontSize: 18, margin: "4px 0" }}>{getWeatherIcon(h.weathercode)}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#e0f0ff" }}>{h.temperature.toFixed(0)}°</div>
                          <div style={{ fontSize: 10, color: r.color, marginTop: 2 }}>{r.level.slice(0, 3)}</div>
                          <div style={{ fontSize: 10, color: "#4fc3f7" }}>{h.precipProb}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 7-DAY DAILY FORECAST */}
                <div style={{ background: "rgba(0,20,50,0.8)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 14, padding: 18 }}>
                  <h3 style={{ margin: "0 0 14px", fontSize: 13, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase" }}>📅 Previsão 7 Dias</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 10 }}>
                    {weather.daily.map((d, i) => {
                      const date = new Date(d.date);
                      const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
                      return (
                        <div key={i} style={{
                          background: "rgba(0,30,60,0.6)", border: "1px solid rgba(0,180,255,0.15)",
                          borderRadius: 10, padding: 12, textAlign: "center",
                        }}>
                          <div style={{ fontSize: 11, color: "#4fc3f7", marginBottom: 4 }}>
                            {i === 0 ? "Hoje" : i === 1 ? "Amanhã" : dayNames[date.getDay()]}
                          </div>
                          <div style={{ fontSize: 22 }}>{getWeatherIcon(d.weathercode)}</div>
                          <div style={{ fontSize: 13, color: "#e0f0ff", marginTop: 4 }}>
                            {d.maxTemp.toFixed(0)}° / {d.minTemp.toFixed(0)}°
                          </div>
                          <div style={{ fontSize: 10, color: "#4fc3f7", marginTop: 2 }}>🌧 {d.precipSum.toFixed(1)}mm</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {loadingWeather && !weather && (
              <div style={{ textAlign: "center", padding: 60, color: "#4fc3f7" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                <div style={{ letterSpacing: 3 }}>OBTENDO DADOS METEOROLÓGICOS...</div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: GLOBAL FORECAST ──────────────────────────────────────────── */}
        {activeTab === "forecast" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, color: "#00e5ff", letterSpacing: 2, textTransform: "uppercase" }}>🌍 Previsão de Catástrofes Globais</h2>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#5b8a99" }}>
                  Dados em tempo real via Open-Meteo · Análise de CAPE, WMO Weather Codes, temperatura extrema
                </p>
              </div>
              <button
                onClick={loadGlobalAlerts}
                disabled={loadingAlerts}
                style={{
                  padding: "8px 16px", background: "rgba(0,229,255,0.08)",
                  border: "1px solid #00e5ff", borderRadius: 8, color: "#00e5ff",
                  fontFamily: "inherit", fontSize: 12, cursor: "pointer", letterSpacing: 1,
                  opacity: loadingAlerts ? 0.6 : 1,
                }}
              >
                {loadingAlerts ? "⏳ Carregando..." : "↻ Atualizar Alertas"}
              </button>
            </div>

            {loadingAlerts && globalAlerts.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#4fc3f7" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🛰️</div>
                <div style={{ letterSpacing: 3 }}>VARRENDO PONTOS GLOBAIS...</div>
                <div style={{ fontSize: 11, color: "#5b8a99", marginTop: 8 }}>Consultando {GLOBAL_HOTSPOTS.length} locais simultaneamente</div>
              </div>
            )}

            {/* Legend */}
            {globalAlerts.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { sev: "extreme", color: "#ff1744", label: "Extremo" },
                  { sev: "high", color: "#ff6d00", label: "Alto" },
                  { sev: "medium", color: "#ffd600", label: "Moderado" },
                  { sev: "low", color: "#00e676", label: "Baixo" },
                ].map((s) => (
                  <div key={s.sev} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                    <span style={{ color: "#7ec8e3" }}>{s.label}</span>
                  </div>
                ))}
                <span style={{ fontSize: 11, color: "#5b8a99", marginLeft: "auto" }}>{globalAlerts.length} alertas detectados</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 14 }}>
              {globalAlerts.map((alert, i) => {
                const colors = { extreme: "#ff1744", high: "#ff6d00", medium: "#ffd600", low: "#00e676" };
                const icons = { lightning: "⚡", earthquake: "🌍", flood: "🌊", extreme_heat: "🔥", cyclone: "🌀" };
                const color = colors[alert.severity];
                return (
                  <div key={i} style={{
                    background: `linear-gradient(135deg, ${color}12, rgba(0,20,50,0.9))`,
                    border: `1px solid ${color}50`, borderRadius: 12, padding: 16,
                    boxShadow: `0 2px 20px ${color}15`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ fontSize: 22 }}>{icons[alert.type]}</span>
                      <span style={{
                        fontSize: 10, padding: "3px 8px", borderRadius: 20,
                        background: `${color}22`, color, border: `1px solid ${color}50`,
                        letterSpacing: 1, textTransform: "uppercase",
                      }}>{alert.severity}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e0f0ff", marginBottom: 4 }}>{alert.location}</div>
                    <div style={{ fontSize: 12, color: "#7ec8e3", marginBottom: 8 }}>{alert.description}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4fc3f7" }}>
                      <span>{alert.type === "lightning" ? "⚡" : alert.type === "extreme_heat" ? "🔥" : "⚠️"} {alert.value} {alert.unit}</span>
                      <span style={{ color: "#5b8a99" }}>{alert.lat.toFixed(2)}°, {alert.lon.toFixed(2)}°</span>
                    </div>
                    {alert.cape !== undefined && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(100, (alert.cape / 4000) * 100)}%`, background: color, borderRadius: 2 }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#5b8a99", marginTop: 3 }}>CAPE: {Math.round(alert.cape)} J/kg</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {globalAlerts.length === 0 && !loadingAlerts && (
              <div style={{ textAlign: "center", padding: 40, color: "#5b8a99" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                <div>Nenhuma anomalia significativa detectada nos pontos monitorados.</div>
                <div style={{ fontSize: 11, marginTop: 6 }}>Clique em "Atualizar Alertas" para nova análise.</div>
              </div>
            )}

            {/* Info box */}
            <div style={{ marginTop: 24, background: "rgba(0,30,60,0.6)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 12, padding: 16 }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 12, color: "#4fc3f7", textTransform: "uppercase", letterSpacing: 2 }}>ℹ️ Sobre os Indicadores</h4>
              <p style={{ margin: 0, fontSize: 12, color: "#5b8a99", lineHeight: 1.7 }}>
                <b style={{ color: "#7ec8e3" }}>CAPE (Convective Available Potential Energy)</b>: Energia disponível para convecção. Valores acima de 1500 J/kg indicam risco alto de trovoadas.
                Os dados são obtidos em tempo real via <b style={{ color: "#00e5ff" }}>Open-Meteo API</b> (gratuita, sem chave API) usando modelos NOAA GFS, DWD ICON e ECMWF IFS.
                Atualização automática a cada hora.
              </p>
            </div>
          </div>
        )}

        {/* ─── TAB: ESP32 ─────────────────────────────────────────────────────── */}
        {activeTab === "esp32" && (
          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: 16, color: "#00e5ff", letterSpacing: 2, textTransform: "uppercase" }}>📡 Controlo ESP32</h2>
            <p style={{ margin: "0 0 20px", fontSize: 12, color: "#5b8a99" }}>
              Envie alertas para o ESP32 via Wi-Fi. O ESP32 aciona o buzzer de forma diferente consoante o nível de risco.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {/* Connection */}
              <div style={{ background: "rgba(0,20,50,0.8)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 14, padding: 20, gridColumn: "1 / -1" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 13, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase" }}>🔌 Configuração do Dispositivo</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ fontSize: 11, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>IP do ESP32</label>
                    <input
                      value={esp32IpInput}
                      onChange={(e) => setEsp32IpInput(e.target.value)}
                      placeholder="192.168.1.100"
                      style={{
                        width: "100%", padding: "10px 14px", background: "rgba(0,30,60,0.8)",
                        border: "1px solid rgba(0,180,255,0.4)", borderRadius: 8, color: "#e0f0ff",
                        fontFamily: "inherit", fontSize: 14, boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEsp32((p) => ({ ...p, ip: esp32IpInput }));
                      setEspLog((prev) => [`[${new Date().toLocaleTimeString("pt-AO")}] Conectando a ${esp32IpInput}...`, ...prev.slice(0, 49)]);
                      setTimeout(() => {
                        const ok = /^\d+\.\d+\.\d+\.\d+$/.test(esp32IpInput);
                        setEsp32((p) => ({ ...p, connected: ok, lastPing: new Date().toLocaleTimeString("pt-AO") }));
                        setEspLog((prev) => [`[${new Date().toLocaleTimeString("pt-AO")}] ${ok ? "✅ ESP32 respondeu ao ping!" : "❌ IP inválido ou sem resposta"}`, ...prev.slice(0, 49)]);
                      }, 1200);
                    }}
                    style={{
                      padding: "10px 20px", background: "rgba(0,229,255,0.1)",
                      border: "1px solid #00e5ff", borderRadius: 8, color: "#00e5ff",
                      fontFamily: "inherit", fontSize: 12, cursor: "pointer", letterSpacing: 1,
                    }}
                  >
                    🔗 Conectar
                  </button>
                  <div style={{
                    padding: "10px 16px", borderRadius: 8,
                    background: esp32.connected ? "rgba(0,230,118,0.1)" : "rgba(255,82,82,0.1)",
                    border: `1px solid ${esp32.connected ? "#00e676" : "#ff5252"}`,
                    color: esp32.connected ? "#00e676" : "#ff5252", fontSize: 12,
                  }}>
                    {esp32.connected ? `✅ ONLINE · ${esp32.ip}` : "❌ OFFLINE"}
                  </div>
                </div>
              </div>

              {/* Manual alarm triggers */}
              <div style={{ background: "rgba(0,20,50,0.8)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 14, padding: 20 }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 13, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase" }}>🔔 Acionar Alarme</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "⚠️ Atenção (PI)", desc: "Risco baixo → buzzer emite um PI curto", cape: 200, wcode: 61 },
                    { label: "🟠 Alerta (PI PI)", desc: "Risco moderado → dois PIs", cape: 800, wcode: 80 },
                    { label: "🔴 Perigo (PIII PIII)", desc: "Risco alto → PIs longos", cape: 2000, wcode: 95 },
                    { label: "🆘 Extremo (PIIIII)", desc: "Risco extremo → PI muito longo contínuo", cape: 4000, wcode: 99 },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => sendESP32Alert(btn.cape, btn.wcode)}
                      disabled={sendingESP}
                      style={{
                        padding: "10px 14px", background: "rgba(0,30,60,0.6)",
                        border: "1px solid rgba(0,180,255,0.3)", borderRadius: 8,
                        color: "#e0f0ff", fontFamily: "inherit", fontSize: 12,
                        cursor: "pointer", textAlign: "left", opacity: sendingESP ? 0.6 : 1,
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{btn.label}</div>
                      <div style={{ fontSize: 10, color: "#5b8a99", marginTop: 2 }}>{btn.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ESP32 Code */}
              <div style={{ background: "rgba(0,20,50,0.8)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 14, padding: 20, overflow: "hidden" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 13, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase" }}>💾 Código ESP32 (Arduino)</h3>
                <pre style={{
                  margin: 0, fontSize: 10, color: "#a0d0e8", overflowX: "auto",
                  background: "rgba(0,0,0,0.4)", padding: 12, borderRadius: 8, lineHeight: 1.6,
                  maxHeight: 260,
                }}>
{`#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "SEU_WIFI";
const char* password = "SUA_SENHA";
const int BUZZER_PIN = 23;

WebServer server(80);

void handleAlert() {
  String level = server.arg("level");
  int risco = level.toInt();
  
  // Risco >= 75: PIII PIII (perigo)
  // Risco < 75:  PI (atenção)
  if (risco >= 75) {
    tone(BUZZER_PIN, 1000, 800);
    delay(1000);
    tone(BUZZER_PIN, 1000, 800);
    delay(1000);
  } else {
    tone(BUZZER_PIN, 800, 300);
    delay(500);
  }
  server.send(200, "text/plain", "OK");
}

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
    delay(500);
  server.on("/alert", handleAlert);
  server.begin();
}

void loop() {
  server.handleClient();
}`}
                </pre>
              </div>
            </div>

            {/* Log */}
            <div style={{ background: "rgba(0,10,30,0.95)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 14, padding: 18 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 13, color: "#4fc3f7", letterSpacing: 2, textTransform: "uppercase" }}>📋 Log de Comunicação</h3>
              <div style={{ height: 200, overflowY: "auto", fontFamily: "monospace" }}>
                {espLog.length === 0 && (
                  <div style={{ color: "#5b8a99", fontSize: 12, fontStyle: "italic" }}>Nenhuma atividade ainda...</div>
                )}
                {espLog.map((line, i) => (
                  <div key={i} style={{
                    fontSize: 11, padding: "3px 0", borderBottom: "1px solid rgba(0,100,180,0.1)",
                    color: line.includes("✅") ? "#00e676" : line.includes("❌") ? "#ff5252" : "#7ec8e3",
                  }}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 32, borderTop: "1px solid rgba(0,180,255,0.1)", paddingTop: 16, fontSize: 10, color: "#2a5a7a", textAlign: "center", letterSpacing: 1 }}>
          SISTEMA DE MONITORAMENTO DE DESCARGAS ATMOSFÉRICAS · ANGOLA · DADOS: OPEN-METEO.COM (CC BY 4.0) · API GRATUITA SEM CHAVE
        </footer>
      </div>
    </div>
  );
}
