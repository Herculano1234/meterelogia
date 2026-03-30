# 🧭 Guia de Navegação - Onde Encontrar Cada Coisa

## 🎯 Se você quer...

### Entender o Projeto Geral
📖 Comece por: **README.md**
- Quick start
- Overview das 3 abas
- Como usar a aplicação

### Ver Análise Técnica Completa
📖 Comece por: **ANALISE_COMPLETA.md**
- Estrutura refatorada
- Componentes detalhados
- Fluxo de dados
- Funcionalidades

### Entender Arquitetura
📖 Comece por: **ARQUITETURA.md**
- Diagrama completo
- Tree de arquivos
- Padrões de desenvolvimento
- Escalabilidade

### Ver Resumo Executivo
📖 Comece por: **SUMARIO_EXECUTIVO.md**
- Números da refatoração
- Benefícios realizados
- Checklist completo

### Listar Todos os Arquivos
📖 Comece por: **LISTA_ARQUIVOS.md**
- Cada arquivo descrito
- Responsabilidade
- Linhas de código

---

## 📁 Estrutura de Arquivos

### `src/types/index.ts` (70 linhas)
**O QUE:** Todas as interfaces TypeScript
**QUANDO USAR:** Quando precisa adicionar um novo tipo
**IMPORTS DE:** Praticamente tudo
**EXEMPLO:**
```typescript
interface WeatherData { temperature, humidity, ... }
```

### `src/constants/`

#### `locations.ts` (90 linhas)
**O QUE:** 18 províncias × 80+ municípios de Angola
**QUANDO USAR:** Quando adicionar nova localidade
**USADO EM:** RealtimeTab
**EXEMPLO:**
```typescript
const ANGOLA_LOCATIONS = [{
  province: "Luanda",
  municipalities: [
    { name: "Luanda", lat: -8.8368, lon: 13.2343 }
  ]
}]
```

#### `hotspots.ts` (20 linhas)
**O QUE:** 16 cidades globais de monitoramento
**QUANDO USAR:** Quando adicionar novo hotspot
**USADO EM:** ForecastTab, fetchGlobalAlerts()
**EXEMPLO:**
```typescript
{ name: "Manaus, Brasil", lat: -3.1019, lon: -60.025 }
```

### `src/services/weatherService.ts` (130 linhas)
**O QUE:** Chamadas para Open-Meteo API
**QUANDO USAR:** Quando precisa modificar requisição de API
**FUNÇÕES:**
- `fetchWeather(lat, lon)` → WeatherData
- `fetchGlobalAlerts()` → GlobalAlert[]

**USADO EM:** useWeather, useGlobalAlerts
**EXEMPLO:**
```typescript
const data = await fetchWeather(-8.8368, 13.2343);
```

### `src/utils/weather.ts` (100 linhas)
**O QUE:** Funções utilitárias de cálculo
**QUANDO USAR:** Quando precisa calcular risco, traduzir código, etc.
**FUNÇÕES:**
- `getWeatherLabel(code)` → String português
- `getWeatherIcon(code)` → Emoji
- `getLightningRisk(cape, wcode)` → RiskLevel

**USADO EM:** Componentes, RealtimeTab, ForecastTab
**EXEMPLO:**
```typescript
const risk = getLightningRisk(2000, 95);  // { level: "ALTO", color: "#ff6d00", score: 75 }
```

### `src/hooks/`

#### `useWeather.ts` (35 linhas)
**O QUE:** Hook para dados meteorológicos locais
**QUANDO USAR:** Quando precisa de dados de tempo de uma localidade
**RETORNA:**
```typescript
{ weather, loading, error, reload }
```
**USADO EM:** LightningMonitor.tsx
**EXEMPLO:**
```typescript
const { weather, loading, error } = useWeather(selectedMunicipality);
```

#### `useGlobalAlerts.ts` (25 linhas)
**O QUE:** Hook para alertas globais
**QUANDO USAR:** Quando precisa de alertas dos 16 hotspots
**RETORNA:**
```typescript
{ alerts, loading, reload }
```
**USADO EM:** LightningMonitor.tsx
**EXEMPLO:**
```typescript
const { alerts, loading } = useGlobalAlerts();
```

#### `useESP32.ts` (95 linhas)
**O QUE:** Hook para controle ESP32
**QUANDO USAR:** Quando precisa comunicar com ESP32
**RETORNA:**
```typescript
{ esp32, ipInput, setIpInput, sending, log, connect, sendAlert }
```
**USADO EM:** LightningMonitor.tsx, ESP32Tab.tsx
**EXEMPLO:**
```typescript
const { connect, sendAlert } = useESP32();
```

### `src/components/Common/`

#### `Header.tsx` (75 linhas)
**O QUE:** Cabeçalho com logo, título, abas e status ESP32
**QUANDO USAR:** Sempre renderizado no topo
**PROPS:**
```typescript
activeTab: string
onTabChange: (tab: "realtime" | "forecast" | "esp32") => void
esp32: ESP32Status
```

#### `Footer.tsx` (20 linhas)
**O QUE:** Rodapé com créditos
**QUANDO USAR:** Sempre renderizado no rodapé
**PROPS:** Nenhuma

#### `TabButton.tsx` (30 linhas)
**O QUE:** Botão de navegação estilizado
**QUANDO USAR:** Para criar abas
**PROPS:**
```typescript
id: string
label: string
isActive: boolean
onClick: () => void
```

#### `RiskGauge.tsx` (100 linhas)
**O QUE:** Indicador visual de risco com barra de progresso
**QUANDO USAR:** Quando precisa mostrar nível de risco
**PROPS:**
```typescript
icon: string, location: string, province: string,
level: string, color: string, score: number,
weatherLabel: string, cape: number,
onAlert: () => void, isLoading: boolean
```
**USADO EM:** RealtimeTab.tsx

#### `Loading.tsx` (15 linhas)
**O QUE:** Componente de carregamento com spinner
**QUANDO USAR:** Quando está carregando dados
**PROPS:**
```typescript
message?: string
```

### `src/components/Cards/`

#### `MetricCard.tsx` (25 linhas)
**O QUE:** Card para exibir métrica meteorológica
**QUANDO USAR:** Na grid de 10 métricas
**PROPS:**
```typescript
icon: string, label: string, value: string, sub: string
```
**USADO EM:** RealtimeTab.tsx

#### `HourlyForecastCard.tsx` (40 linhas)
**O QUE:** Card para previsão horária
**QUANDO USAR:** Na previsão 24h
**PROPS:**
```typescript
hour: HourlyForecast
```
**USADO EM:** RealtimeTab.tsx

#### `DailyForecastCard.tsx` (40 linhas)
**O QUE:** Card para previsão diária
**QUANDO USAR:** Na previsão 7 dias
**PROPS:**
```typescript
daily: DailyForecast, index: number
```
**USADO EM:** RealtimeTab.tsx

#### `AlertCard.tsx` (90 linhas)
**O QUE:** Card para exibir alerta global
**QUANDO USAR:** Na grid de alertas
**PROPS:**
```typescript
alert: GlobalAlert
```
**USADO EM:** ForecastTab.tsx

### `src/components/Tabs/`

#### `RealtimeTab.tsx` (240 linhas) ⚡
**O QUE:** Tab de Tempo Real
**COMPONENTES:**
- Location Selector (Província + Município)
- RiskGauge (Indicador de risco)
- Metrics Grid (10 cards)
- Hourly Forecast (24h)
- Daily Forecast (7 dias)

**PROPS:**
```typescript
weather, loadingWeather, weatherError,
selectedMunicipality, selectedProvince,
onLocationChange, onReload, onSendAlert, sendingAlert
```

**USADO EM:** LightningMonitor.tsx

#### `ForecastTab.tsx` (120 linhas) 🌍
**O QUE:** Tab de Previsão Global
**COMPONENTES:**
- Botão Refresh
- Legend (por severidade)
- Alert Cards Grid
- Info Box sobre CAPE

**PROPS:**
```typescript
alerts, loadingAlerts, onReload
```

**USADO EM:** LightningMonitor.tsx

#### `ESP32Tab.tsx` (200 linhas) 📡
**O QUE:** Tab de Controle ESP32
**COMPONENTES:**
- IP Input + Connect
- Status Badge
- 4 Alarm Buttons
- Arduino Code Block
- Log Console

**PROPS:**
```typescript
esp32, ipInput, setIpInput, sending, log,
onConnect, onSendAlert
```

**USADO EM:** LightningMonitor.tsx

### `src/LightningMonitor.tsx` (160 linhas)
**O QUE:** Componente principal que orquestra tudo
**RESPONSABILIDADES:**
- State: activeTab, selectedProvince, selectedMunicipality
- Hooks: useWeather, useGlobalAlerts, useESP32
- useEffect: auto-refresh, auto-alerts, load on tab change
- Render: <Header /> + <Tab /> + <Footer />
- Estilos globais

**EXEMPLO:**
```typescript
<LightningMonitor />  // Renderiza tudo
```

---

## 🔍 Como Encontrar Algo

### "Preciso adicionar uma nova aba"
1. Crie `src/components/Tabs/NewTab.tsx`
2. Importe em `LightningMonitor.tsx`
3. Adicione caso em `{activeTab === "new" && <NewTab />}`

### "Preciso modificar o cálculo de risco"
1. Edite `src/utils/weather.ts`
2. Função `getLightningRisk()`

### "Preciso adicionar nova localidade em Angola"
1. Edite `src/constants/locations.ts`
2. Adicione em `ANGOLA_LOCATIONS`

### "Preciso adicionar novo hotspot global"
1. Edite `src/constants/hotspots.ts`
2. Adicione em `GLOBAL_HOTSPOTS`

### "Preciso modificar estilo de um card"
1. Edite `src/components/Cards/MetricCard.tsx` (ex.)
2. Modifique o `style={{}}` do componente

### "Preciso adicionar novo tipo"
1. Edite `src/types/index.ts`
2. Adicione interface

### "Preciso debugar API"
1. Verifique `src/services/weatherService.ts`
2. Adicione `console.log()` nas funções

### "Preciso adicionar teste"
1. Crie `src/utils/weather.test.ts` (ex.)
2. Importe função a testar
3. Crie casos com Jest

---

## 🚀 Fluxo de Uma Feature Completa

### Exemplo: "Adicionar nova métrica de velocidade do vento"

#### Passo 1: Type
```typescript
// src/types/index.ts
interface WeatherData {
  windspeed: number  // ← Já existe!
}
```

#### Passo 2: Service (se precisar API nova)
```typescript
// src/services/weatherService.ts
// Já está fetching windspeed via URL
```

#### Passo 3: Utils (se precisar cálculo)
```typescript
// src/utils/weather.ts
export function getWindRisk(windspeed: number): string {
  if (windspeed > 80) return "Extremo";
  // ...
}
```

#### Passo 4: Component
```typescript
// src/components/Cards/WindCard.tsx
export function WindCard({ windspeed, windRisk }) {
  return <MetricCard icon="💨" label="Vento" value={windspeed} sub={windRisk} />
}
```

#### Passo 5: Integração
```typescript
// src/components/Tabs/RealtimeTab.tsx
<div style={{ display: "grid", ... }}>
  <WindCard windspeed={weather.windspeed} windRisk={getWindRisk(weather.windspeed)} />
  {/* ... outros cards */}
</div>
```

**Pronto! 3 arquivos modificados, 1 criado.**

---

## 📚 Referências Rápidas

| Preciso de... | Arquivo | Linha |
|---|---|---|
| Tipos | `src/types/index.ts` | 1-70 |
| Localidades Angola | `src/constants/locations.ts` | 1-90 |
| Hotspots globais | `src/constants/hotspots.ts` | 1-20 |
| Chamadas API | `src/services/weatherService.ts` | 1-130 |
| Funções de cálculo | `src/utils/weather.ts` | 1-100 |
| Hook de clima | `src/hooks/useWeather.ts` | 1-35 |
| Hook de alertas | `src/hooks/useGlobalAlerts.ts` | 1-25 |
| Hook de ESP32 | `src/hooks/useESP32.ts` | 1-95 |
| Cabeçalho | `src/components/Common/Header.tsx` | 1-75 |
| Indicador de risco | `src/components/Common/RiskGauge.tsx` | 1-100 |
| Métrica | `src/components/Cards/MetricCard.tsx` | 1-25 |
| Alerta | `src/components/Cards/AlertCard.tsx` | 1-90 |
| Tempo Real | `src/components/Tabs/RealtimeTab.tsx` | 1-240 |
| Previsão Global | `src/components/Tabs/ForecastTab.tsx` | 1-120 |
| ESP32 | `src/components/Tabs/ESP32Tab.tsx` | 1-200 |
| Orquestração | `src/LightningMonitor.tsx` | 1-160 |

---

## 💡 Dicas Úteis

1. **Para entender o fluxo**: Comece em `LightningMonitor.tsx` e siga os imports
2. **Para debugar**: Use browser DevTools + adicione logs em services
3. **Para adicionar feature**: Siga o padrão "Type → Service → Utils → Component → Integração"
4. **Para testar**: Isole função em utils, crie teste com Jest
5. **Para deployr**: `npm run build`, envie `dist/`

---

**Criado em:** 30 de Março de 2026  
**Versão:** 1.0.0  
**Status:** ✅ Documentado
