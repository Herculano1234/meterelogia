# 🗂️ Arquitetura do Projeto - Diagrama Detalhado

## Tree de Arquivos Completa

```
herculano_pap/
├── src/
│   ├── types/
│   │   └── index.ts
│   │       ├── Location
│   │       ├── WeatherData
│   │       ├── HourlyForecast
│   │       ├── DailyForecast
│   │       ├── GlobalAlert
│   │       ├── ESP32Status
│   │       └── RiskLevel
│   │
│   ├── constants/
│   │   ├── locations.ts (18 províncias × 80+ municípios)
│   │   └── hotspots.ts (16 cidades globais)
│   │
│   ├── services/
│   │   └── weatherService.ts
│   │       ├── fetchWeather(lat, lon) → Open-Meteo
│   │       └── fetchGlobalAlerts() → Promise.allSettled x16
│   │
│   ├── utils/
│   │   └── weather.ts
│   │       ├── getWeatherLabel(code)
│   │       ├── getWeatherIcon(code)
│   │       └── getLightningRisk(cape, weathercode)
│   │
│   ├── hooks/
│   │   ├── useWeather.ts
│   │   │   └── Gerencia estado local de weather
│   │   ├── useGlobalAlerts.ts
│   │   │   └── Gerencia estado de alertas globais
│   │   └── useESP32.ts
│   │       └── Gerencia ESP32 + log
│   │
│   ├── components/
│   │   ├── Common/
│   │   │   ├── Header.tsx
│   │   │   │   └── Logo + Title + Tabs + ESP32 Status
│   │   │   ├── Footer.tsx
│   │   │   │   └── Créditos + Info
│   │   │   ├── TabButton.tsx
│   │   │   │   └── Botão estilizado
│   │   │   ├── RiskGauge.tsx
│   │   │   │   └── Indicador visual com barra de progresso
│   │   │   └── Loading.tsx
│   │   │       └── Spinner com mensagem
│   │   │
│   │   ├── Cards/
│   │   │   ├── MetricCard.tsx
│   │   │   │   └── Icon + Label + Value + Sub
│   │   │   ├── HourlyForecastCard.tsx
│   │   │   │   └── Hora + Ícone + Temp + Risk
│   │   │   ├── DailyForecastCard.tsx
│   │   │   │   └── Dia + Ícone + Temp Min/Max + Precip
│   │   │   └── AlertCard.tsx
│   │   │       └── Ícone + Severidade + Descrição + CAPE
│   │   │
│   │   └── Tabs/
│   │       ├── RealtimeTab.tsx
│   │       │   ├── Location Selector
│   │       │   ├── RiskGauge
│   │       │   ├── Metrics Grid (10 cards)
│   │       │   ├── Hourly Forecast (24h)
│   │       │   └── Daily Forecast (7d)
│   │       │
│   │       ├── ForecastTab.tsx
│   │       │   ├── Header com botão refresh
│   │       │   ├── Legend (severidade)
│   │       │   ├── Grid de AlertCards
│   │       │   └── Info box (CAPE explanation)
│   │       │
│   │       └── ESP32Tab.tsx
│   │           ├── IP Input + Connect Button
│   │           ├── ESP32 Status Badge
│   │           ├── 4 Alarm Buttons
│   │           ├── Arduino Code Block
│   │           └── Log Console
│   │
│   ├── LightningMonitor.tsx (MAIN COMPONENT)
│   │   ├── useState: activeTab, selectedProvince, selectedMunicipality
│   │   ├── useWeather(selectedMunicipality)
│   │   ├── useGlobalAlerts()
│   │   ├── useESP32()
│   │   ├── useEffect: auto-refresh 5min
│   │   ├── useEffect: load alerts on tab change
│   │   ├── useEffect: auto-alert ESP32
│   │   ├── Render: <Header />
│   │   ├── Render: <RealtimeTab /> | <ForecastTab /> | <ESP32Tab />
│   │   └── Render: <Footer />
│   │
│   └── main.tsx
│       └── ReactDOM.render(<LightningMonitor />)
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── ANALISE_COMPLETA.md
└── ARQUITETURA.md (este arquivo)
```

---

## 🔄 Fluxo de Componentes

```
┌─────────────────────────────────────────────────────┐
│     LightningMonitor (Componente Principal)         │
│  - Orquestra hooks e gerencia estado global         │
└──────────────┬──────────────────────────────────────┘
               │
        ┌──────┼──────┬──────────────┐
        │      │      │              │
    ┌───▼──┐  │  ┌───▼────┐  ┌─────▼──────┐
    │Header│  │  │useWeather  │useGlobalAlerts
    │      │  │  │            │useESP32
    └──────┘  │  └────────┘  └────────────┘
             │
     ┌───────┴────────┬───────────────┬──────────────┐
     │                │               │              │
  ┌──▼──────────┐ ┌──▼──────────┐ ┌─▼──────────┐ ┌──▼──────┐
  │ RealtimeTab │ │ ForecastTab │ │ ESP32Tab   │ │  Footer │
  │             │ │             │ │            │ │         │
  │ - Location  │ │ - Alerts    │ │ - IP Input │ │ Créditos│
  │ - RiskGauge │ │   Grid      │ │ - Alarms   │ │         │
  │ - Metrics   │ │ - Legend    │ │ - Code     │ │         │
  │ - Forecast  │ │ - Info box  │ │ - Log      │ │         │
  └─────────────┘ └─────────────┘ └────────────┘ └─────────┘
```

---

## 📊 Componentes por Responsabilidade

### 🎯 Smart Components (com lógica)
- `LightningMonitor` → Orquestração
- Hooks: `useWeather`, `useGlobalAlerts`, `useESP32`

### 🎨 Presentation Components (puros)
- **Cards**: `MetricCard`, `HourlyForecastCard`, `DailyForecastCard`, `AlertCard`
- **Common**: `Header`, `Footer`, `TabButton`, `RiskGauge`, `Loading`
- **Tabs**: `RealtimeTab`, `ForecastTab`, `ESP32Tab`

### 🔧 Services (sem React)
- `weatherService.ts` → Fetch + processamento de dados

### 📦 Utils (funções puras)
- `weather.ts` → Cálculos e mapeamentos

### ⚙️ Constants (dados)
- `locations.ts`, `hotspots.ts` → Dados estáticos

---

## 🔌 Interfaces de Dados

```typescript
// Fluxo de Dados: Serviço → Hook → Componente

// 1. fetchWeather() → WeatherData
WeatherData {
  temperature, humidity, windspeed, precipitation,
  cloudcover, weathercode, apparent_temperature,
  surface_pressure, visibility, uv_index,
  precipitation_probability, cape, lifted_index,
  forecast: HourlyForecast[],    // 24 items
  daily: DailyForecast[]         // 7 items
}

// 2. fetchGlobalAlerts() → GlobalAlert[]
GlobalAlert {
  location, lat, lon,
  type: "lightning" | "earthquake" | "flood" | "extreme_heat" | "cyclone",
  severity: "low" | "medium" | "high" | "extreme",
  value, unit, description, cape
}

// 3. useESP32() → ESP32Status
ESP32Status {
  connected: boolean,
  ip: string,
  lastPing: string,
  alarmSent: boolean
}

// 4. getLightningRisk() → RiskLevel
RiskLevel {
  level: string,      // "EXTREMO", "ALTO", "MODERADO", "BAIXO", "MÍNIMO"
  color: string,      // "#ff1744", "#ff6d00", "#ffd600", "#00e676", "#00b0ff"
  score: number       // 5, 20, 45, 75, 100
}
```

---

## 🎨 Sistema de Cores

```
┌─────────────────────────────────────────┐
│ Risco de Relâmpago → Cor → Ação         │
├─────────────────────────────────────────┤
│ MÍNIMO      → 🔵 #00b0ff  → Nada        │
│ BAIXO       → 🟢 #00e676  → Atenção     │
│ MODERADO    → 🟡 #ffd600  → Alerta     │
│ ALTO        → 🟠 #ff6d00  → Perigo     │
│ EXTREMO     → 🔴 #ff1744  → SOS        │
└─────────────────────────────────────────┘

Score: 0% → 100% (RiskLevel.score)
Mapeado em barra de progresso visual
```

---

## 📡 API Integration

```
┌──────────────────────────────────────────────┐
│      Open-Meteo API (Gratuita)               │
├──────────────────────────────────────────────┤
│ Endpoint: https://api.open-meteo.com/v1/...  │
│                                              │
│ fetchWeather():                              │
│   GET /forecast?latitude=X&longitude=Y       │
│       ├─ current (temperatura, CAPE, etc)   │
│       ├─ hourly (próximas 24h)              │
│       └─ daily (próximos 7 dias)            │
│                                              │
│ fetchGlobalAlerts():                         │
│   Promise.allSettled([                       │
│     GET /forecast?lat=X1&lon=Y1,            │
│     GET /forecast?lat=X2&lon=Y2,            │
│     ...                          (16 no total)
│   ])                                        │
└──────────────────────────────────────────────┘
```

---

## 🧪 Padrões de Desenvolvimento

### 1. Custom Hooks Pattern
```typescript
// Hook: Lógica + Estado
export function useWeather(location) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const data = await fetchWeather(...);
    setWeather(data);
  }, [location]);
  
  return { weather, loading, reload };
}

// Componente: apenas renderiza
export function RealtimeTab({ weather, loading }) {
  return <div>{weather && <MetricCard {...weather} />}</div>
}
```

### 2. Composition Pattern
```typescript
// Pequenos componentes + composição
<div>
  <Header />
  {activeTab === "realtime" && <RealtimeTab />}
  {activeTab === "forecast" && <ForecastTab />}
  {activeTab === "esp32" && <ESP32Tab />}
  <Footer />
</div>
```

### 3. Controlled Components
```typescript
// Estado em componente pai, props em filho
const [selectedProvince, setSelectedProvince] = useState("Luanda");

<LocationSelector 
  value={selectedProvince}
  onChange={setSelectedProvince}
/>
```

---

## 📈 Escalabilidade

### Adicionar Novo Indicador Meteorológico
1. Solicite via `fetchWeather()` → Add em URL
2. Mapeie em `WeatherData` interface
3. Crie `IndicadorCard.tsx`
4. Add em RealtimeTab metrics grid

### Adicionar Nova Cidade Global
1. Add em `hotspots.ts`
2. Automático em `fetchGlobalAlerts()`

### Adicionar Novo Tipo de Alerta
1. Add tipo em `GlobalAlert.type`
2. Add ícone em `ESP32Tab`
3. Add lógica em `fetchGlobalAlerts()`

---

## 🚀 Otimizações Implementadas

✅ **Parallelização**: `Promise.allSettled()` para 16 hotspots (vs sequencial)
✅ **Memoização**: Constants não recalculados a cada render
✅ **Lazy Loading**: Alertas globais carregados ao clicar na tab
✅ **Debounce**: Auto-refresh cada 5 min (não overload)
✅ **Code Splitting**: Componentes separados (fácil code splitting no futuro)

---

## 🔍 Debugging

### Debug Weather Data
```javascript
// Em RealtimeTab.tsx
console.log('Weather:', weather);
console.log('CAPE:', weather?.cape);
console.log('Risk Level:', getLightningRisk(weather?.cape, weather?.weathercode));
```

### Debug Alerts
```javascript
// Em ForecastTab.tsx
console.log('Global Alerts:', alerts);
console.log('Severity Count:', {
  extreme: alerts.filter(a => a.severity === 'extreme').length,
  high: alerts.filter(a => a.severity === 'high').length,
});
```

### Debug ESP32
```javascript
// Em useESP32.ts
console.log('ESP32 Log:', log);
console.log('Last 5 logs:', log.slice(0, 5));
```

---

## 📚 Referências de Código

### Imports Principais
```typescript
// types
import { Location, WeatherData, GlobalAlert, ESP32Status, RiskLevel } from "./types";

// constants
import { ANGOLA_LOCATIONS } from "./constants/locations";
import { GLOBAL_HOTSPOTS } from "./constants/hotspots";

// services
import { fetchWeather, fetchGlobalAlerts } from "./services/weatherService";

// utils
import { getWeatherLabel, getWeatherIcon, getLightningRisk } from "./utils/weather";

// hooks
import { useWeather } from "./hooks/useWeather";
import { useGlobalAlerts } from "./hooks/useGlobalAlerts";
import { useESP32 } from "./hooks/useESP32";

// components
import { Header, Footer, RiskGauge, Loading } from "./components/Common";
import { MetricCard, AlertCard } from "./components/Cards";
import { RealtimeTab, ForecastTab, ESP32Tab } from "./components/Tabs";
```

---

**Total de Arquivos:** 21
**Linhas de Código:** ~1500 (vs 996 original)
**Componentes:** 3 tabs + 10 cards + 5 common
**Hooks:** 3 customizados
**Tipos:** 7 interfaces
**Constantes:** 80+ locais + 16 hotspots
