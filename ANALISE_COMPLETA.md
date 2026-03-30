# 📊 Análise Completa do Projeto - Sistema de Monitoramento de Descargas Atmosféricas

## 📋 Visão Geral

Sistema interativo para monitoramento em tempo real de descargas atmosféricas (relâmpagos) em Angola, com previsão de catástrofes globais e integração com dispositivo ESP32 para alertas de buzzer.

**Stack:** Vite + React 19 + TypeScript + Open-Meteo API

---

## 🗂️ Estrutura Refatorada

### Estrutura de Diretórios

```
src/
├── types/
│   └── index.ts                    # Tipos e interfaces centralizadas
├── constants/
│   ├── locations.ts                # Dados de províncias e municípios de Angola
│   └── hotspots.ts                 # Pontos de monitoramento globais
├── services/
│   └── weatherService.ts           # Serviços de API (Open-Meteo)
├── utils/
│   └── weather.ts                  # Funções utilitárias (cálculos, rótulos)
├── hooks/
│   ├── useWeather.ts               # Hook para dados meteorológicos locais
│   ├── useGlobalAlerts.ts          # Hook para alertas globais
│   └── useESP32.ts                 # Hook para controle do ESP32
├── components/
│   ├── Common/
│   │   ├── Header.tsx              # Cabeçalho com abas e status
│   │   ├── Footer.tsx              # Rodapé
│   │   ├── TabButton.tsx           # Botão de abas
│   │   ├── RiskGauge.tsx           # Indicador visual de risco
│   │   └── Loading.tsx             # Componente de carregamento
│   ├── Cards/
│   │   ├── MetricCard.tsx          # Card de métrica meteorológica
│   │   ├── HourlyForecastCard.tsx  # Card de previsão horária
│   │   ├── DailyForecastCard.tsx   # Card de previsão diária
│   │   └── AlertCard.tsx           # Card de alerta global
│   └── Tabs/
│       ├── RealtimeTab.tsx         # Tab: Tempo Real (localização específica)
│       ├── ForecastTab.tsx         # Tab: Previsão Global (hotspots)
│       └── ESP32Tab.tsx            # Tab: Controle do ESP32
├── LightningMonitor.tsx            # Componente principal (orquestração)
└── main.tsx                        # Ponto de entrada React
```

---

## 📦 Componentes Modularizados

### 1. **Types** (`src/types/index.ts`)
Centraliza todas as interfaces:
- `Location`: Informações de local (lat, lon, nome, província)
- `WeatherData`: Dados meteorológicos completos
- `HourlyForecast`: Previsão horária
- `DailyForecast`: Previsão diária
- `GlobalAlert`: Alerta global
- `ESP32Status`: Status de conexão do ESP32
- `RiskLevel`: Nível de risco com cor e score

### 2. **Constants**
- **locations.ts**: 18 províncias + 80+ municípios de Angola
- **hotspots.ts**: 16 cidades globais de monitoramento

### 3. **Services** (`src/services/weatherService.ts`)
Funções de API:
- `fetchWeather(lat, lon)`: Busca dados da Open-Meteo API
- `fetchGlobalAlerts()`: Consulta alertas em 16 hotspots em paralelo

### 4. **Utils** (`src/utils/weather.ts`)
Funções utilitárias:
- `getWeatherLabel(code)`: Traduz código WMO → português
- `getWeatherIcon(code)`: Emoji baseado em código
- `getLightningRisk(cape, weathercode)`: Calcula nível de risco

### 5. **Hooks Customizados**

#### `useWeather(location)`
- Gerencia estado de dados meteorológicos
- Auto-carrega ao mudar localização
- Retorna: `{ weather, loading, error, reload }`

#### `useGlobalAlerts()`
- Carrega alertas de hotspots globais
- Retorna: `{ alerts, loading, reload }`

#### `useESP32()`
- Simula comunicação com ESP32
- Funções: `connect(ip)`, `sendAlert(cape, wcode, auto)`
- Mantém log de comunicação
- Retorna: `{ esp32, ipInput, setIpInput, sending, log, connect, sendAlert }`

### 6. **Componentes Comuns**
- **Header**: Logo, título, abas, status ESP32
- **Footer**: Créditos e informações
- **TabButton**: Botão de navegação estilizado
- **RiskGauge**: Indicador visual de risco (barra de progresso + cores)
- **Loading**: Spinner com mensagem

### 7. **Cards (Reutilizáveis)**
- **MetricCard**: Exibe métrica com ícone, valor e descrição
- **HourlyForecastCard**: Previsão para 1 hora
- **DailyForecastCard**: Previsão para 1 dia
- **AlertCard**: Exibe alerta com severidade e gráfico CAPE

### 8. **Tabs (Componentes Maiores)**

#### **RealtimeTab**
- Seletor de província/município
- Exibe dados em tempo real
- Gauge de risco de relâmpago
- Grid de 10 métricas meteorológicas
- Previsão horária (próximas 24h)
- Previsão diária (7 dias)
- Botão para alertar ESP32

#### **ForecastTab**
- Consulta 16 hotspots globais em paralelo
- Filtra por severidade (extremo → baixo)
- Exibe cards de alertas com CAPE, temperatura, localização
- Info box sobre CAPE e Open-Meteo API

#### **ESP32Tab**
- Campo de entrada para IP do ESP32
- Botão de conexão com simulação de ping
- 4 botões de alarme pré-configurados
- Código Arduino de exemplo
- Log de comunicação (últimas 50 linhas)

### 9. **LightningMonitor.tsx (Principal)**
- Orquestra todos os componentes
- Gerencia estado global (tab ativa, localização)
- Auto-refresh a cada 5 minutos (realtime)
- Auto-alerta ESP32 se CAPE > 500 ou weathercode >= 95
- Estilos globais (background com grid animado)

---

## 🔄 Fluxo de Dados

```
App (LightningMonitor)
├── useWeather(selectedMunicipality)
│   └── fetchWeather(lat, lon) → Open-Meteo API
│       └── weather: WeatherData
├── useGlobalAlerts()
│   └── fetchGlobalAlerts() → Promise.allSettled x 16 hotspots
│       └── globalAlerts: GlobalAlert[]
├── useESP32()
│   └── Simula comunicação Wi-Fi
│       └── esp32: ESP32Status + log
└── Renderiza tab ativa
    └── RealtimeTab | ForecastTab | ESP32Tab
```

---

## 📊 Dados

### Angola (Localidades)
- **18 Províncias**
- **80+ Municípios** com coordenadas exatas
- Coordenadas: `-8.8°` (Luanda) até `-17.0°` (Cunene)

### Hotspots Globais
1. Manaus, Brasil
2. Jakarta, Indonésia
3. Lagos, Nigéria
4. Caracas, Venezuela
5. Colombo, Sri Lanka
6. Libreville, Gabão
7. Yangon, Myanmar
8. Kinshasa, R.D. Congo
9. Manila, Filipinas
10. Dhaka, Bangladesh
11. Miami, EUA
12. Tokio, Japão
13. Mumbai, Índia
14. Ciudad de México
15. São Paulo, Brasil
16. Lusaka, Zâmbia

---

## 🌐 APIs Integradas

### Open-Meteo (Gratuita, sem chave API)
**Endpoints:**
- Current weather
- Hourly forecast (próximas 24h)
- Daily forecast (7 dias)
- Dados especiais:
  - **CAPE** (Convective Available Potential Energy): indica energia para trovoadas
  - **Lifted Index**: indicador de instabilidade
  - **Weather Code** (WMO): padrão internacional

**Modelos usados:**
- NOAA GFS (América)
- DWD ICON (Europa)
- ECMWF IFS (Global)

---

## 🎨 Estilos

- **Tema**: Dark mode futurístico (azul/ciano)
- **Cores por Risco:**
  - Azul: Mínimo
  - Verde: Baixo
  - Amarelo: Moderado
  - Laranja: Alto
  - Vermelho: Extremo
- **Font**: Space Mono (monospace futurista)
- **Responsivo**: `clamp()` para escalabilidade

---

## 🔧 Funcionalidades

### Tab 1: Tempo Real
✅ Seleção de localização (18 províncias × 80+ municípios)
✅ Gauge visual de risco com barra de progresso
✅ 10 métricas meteorológicas (temp, humidade, vento, etc.)
✅ Previsão horária (próximas 24h)
✅ Previsão diária (7 dias)
✅ Auto-alerta ESP32 se risco alto
✅ Auto-refresh cada 5 minutos

### Tab 2: Previsão Global
✅ Monitoramento de 16 hotspots simultâneos
✅ Cálculo de CAPE máximo em 72h
✅ Filtragem por tipo de alerta (relâmpago, calor extremo)
✅ Ordenação por severidade
✅ Exibição em cards com gráfico CAPE

### Tab 3: ESP32 Control
✅ Configuração de IP do ESP32
✅ Simulação de conexão Wi-Fi
✅ 4 botões de alarme pré-programados
✅ Log de comunicação em tempo real
✅ Código Arduino de exemplo

---

## 📈 Métricas Monitoradas

### Locais
- Temperatura atual e aparente
- Humidade relativa
- Velocidade do vento
- Precipitação
- Cobertura de nuvens
- Pressão superficial
- **CAPE** (crucial para relâmpagos)
- Lifted Index
- Índice UV
- Visibilidade

### Globais
- CAPE máximo (próximas 72h)
- Temperatura extrema (> 40°C)
- Detecção de trovoada (weathercode >= 95)

---

## 🔌 ESP32 Integration

### Código Arduino Incluído
```cpp
#include <WiFi.h>
#include <WebServer.h>

WebServer server(80);

void handleAlert() {
  int risco = server.arg("level").toInt();
  if (risco >= 75) {
    // PIII PIII (perigo)
    tone(BUZZER_PIN, 1000, 800);
  } else {
    // PI (atenção)
    tone(BUZZER_PIN, 800, 300);
  }
}
```

### Simulação
- Alerta enviado via HTTP GET
- Resposta simulada com delay (1.5s)
- Taxa de sucesso: 85%

---

## 🚀 Performance

- **Parallelização**: `Promise.allSettled()` para 16 hotspots
- **Memoização**: Dados em constants (não recalculados)
- **Debounce**: Auto-refresh cada 5 min (não em tempo real puro)
- **Lazy Loading**: Alertas globais carregados ao clicar na tab

---

## 📝 Resumo de Benefícios da Modularização

| Antes | Depois |
|-------|--------|
| 1 arquivo monolítico (500+ linhas) | 20+ arquivos especializados |
| Lógica misturada | Separação de conceitos |
| Difícil de testar | Fácil de testar (hooks, utils) |
| Dificuldade para reutilizar | Componentes reutilizáveis |
| Manutenção complexa | Manutenção simplificada |

---

## 📚 Próximas Melhorias Possíveis

1. **Persistência**: localStorage para favoritos/histórico
2. **Testes**: Jest + React Testing Library
3. **Autenticação**: Se houver backend próprio
4. **WebSocket**: Para alertas em tempo real (vs 5 min)
5. **Mapas**: Integração com Leaflet/Mapbox
6. **Notificações**: Push notifications ao ESP32
7. **Dark/Light Mode**: Toggle de tema
8. **Histórico**: Gráficos de tendência de CAPE

---

**Versão:** 1.0.0
**Linguagem:** TypeScript + React
**Status:** ✅ Refatorado e Modularizado
