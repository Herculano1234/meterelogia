# ⚡ Sistema de Monitoramento de Descargas Atmosféricas

Sistema interativo para monitoramento em tempo real de descargas atmosféricas em Angola e previsão de catástrofes globais, com integração ESP32.

## 🚀 Quick Start

### Instalação
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

---

## 📁 Estrutura do Projeto

```
src/
├── types/               # Tipagens TypeScript
├── constants/           # Dados estáticos (Angola, hotspots globais)
├── services/            # Chamadas de API (Open-Meteo)
├── utils/               # Funções utilitárias
├── hooks/               # Hooks customizados (useWeather, useGlobalAlerts, useESP32)
├── components/
│   ├── Common/          # Header, Footer, TabButton, RiskGauge, Loading
│   ├── Cards/           # MetricCard, ForecastCard, AlertCard
│   └── Tabs/            # RealtimeTab, ForecastTab, ESP32Tab
└── LightningMonitor.tsx # Componente principal
```

---

## 📊 Três Abas Principais

### 1️⃣ **Tempo Real** ⚡
Monitoramento em tempo real de uma localidade específica em Angola.

**Funcionalidades:**
- Seleção de província e município
- Indicador visual de risco (barra de progresso colorida)
- 10 métricas meteorológicas
- Previsão horária (próximas 24h)
- Previsão diária (7 dias)
- Botão para alertar ESP32

**Localidades:** 18 províncias × 80+ municípios

### 2️⃣ **Previsão Global** 🌍
Monitoramento de catástrofes em 16 hotspots globais.

**Funcionalidades:**
- Análise paralela de 16 cidades
- Detecção de relâmpagos (CAPE > 500 J/kg)
- Detecção de calor extremo (T > 40°C)
- Filtro por severidade
- Gráfico CAPE por alerta

**Cidades monitoradas:**
Manaus, Jakarta, Lagos, Caracas, Colombo, Libreville, Yangon, Kinshasa, Manila, Dhaka, Miami, Tokio, Mumbai, México, São Paulo, Lusaka

### 3️⃣ **ESP32 Control** 📡
Controle remoto do buzzer via dispositivo ESP32.

**Funcionalidades:**
- Configuração de IP do dispositivo
- 4 alarmes pré-programados (atenção → extremo)
- Código Arduino de exemplo incluído
- Log de comunicação em tempo real

---

## 🎯 Indicadores Meteorológicos

### Risco de Relâmpago
Baseado em **CAPE** (Convective Available Potential Energy):

| Nível | CAPE | Weathercode | Cor | Ação |
|-------|------|-------------|-----|------|
| EXTREMO | > 3000 | ≥ 95 | 🔴 Vermelho | Alerta máximo |
| ALTO | > 1500 | ≥ 80 | 🟠 Laranja | Alerta ESP32 |
| MODERADO | > 500 | ≥ 61 | 🟡 Amarelo | Atenção |
| BAIXO | > 100 | - | 🟢 Verde | Normal |
| MÍNIMO | < 100 | - | 🔵 Azul | Seguro |

### Métricas Exibidas
- **Temperatura**: Atual + sensação térmica
- **Humidade**: % relativa
- **Vento**: km/h
- **Precipitação**: mm + probabilidade
- **Nuvens**: % cobertura
- **Pressão**: hPa
- **CAPE**: J/kg (crucial!)
- **Lifted Index**: Instabilidade atmosférica
- **UV Index**: Exposição UV
- **Visibilidade**: km

---

## 🔌 Integração ESP32

### Hardware Necessário
- Placa ESP32
- Buzzer/Speaker piezo (GPIO 23)
- Conexão Wi-Fi

### Código Arduino
Incluso na aba "ESP32 Control". Copia e cola no Arduino IDE.

**O que faz:**
```cpp
- Conecta à rede Wi-Fi
- Escuta requisições HTTP na porta 80
- Aciona buzzer baseado no nível de risco
- Responde "OK" ao servidor
```

### Padrões de Buzzer
- **PI** (curto): Risco baixo
- **PI PI** (dois): Risco moderado  
- **PIII PIII** (longos): Risco alto
- **PIIIII** (contínuo): Extremo

---

## 📡 Dados Externos

### Open-Meteo API
- ✅ Gratuita, sem chave API
- ✅ Modelos: NOAA GFS, DWD ICON, ECMWF IFS
- ✅ Cobertura global
- ✅ Dados horários e diários

**Endpoints usados:**
- `/forecast?current=...` → Dados atuais
- `/forecast?hourly=...` → Próximas 24h
- `/forecast?daily=...` → Próximos 7 dias

### CAPE (Convective Available Potential Energy)
Energia disponível para convecção atmosférica. Indicador chave para:
- Formação de trovoadas
- Intensidade de tempestades
- Risco de relâmpagos

---

## ⚙️ Configuração

### Auto-refresh
- Realtime tab: a cada 5 minutos
- Forecast tab: ao clicar em "Atualizar Alertas"
- ESP32: manual ou auto-trigger se CAPE > 500

### Localização Padrão
- Província: Luanda
- Município: Luanda

### IP ESP32 Padrão
- `192.168.1.100` (configurável)

---

## 🎨 Design

### Tema
- Fundo: Gradient azul/ciano escuro
- Grid animado de fundo
- Ícone ⚡ flutuante

### Responsividade
- Mobile-first
- Breakpoints automáticos com `clamp()`
- Grid dinâmico com `auto-fill`

### Acessibilidade
- Cores vibrantes por nível de risco
- Ícones + texto para cada dado
- Contraste adequado

---

## 🔄 Fluxo de Dados

```
App (LightningMonitor)
│
├─ useWeather()
│  └─ Open-Meteo: GET /forecast?lat=X&lon=Y
│     └─ WeatherData (temp, CAPE, forecast, daily)
│
├─ useGlobalAlerts()
│  └─ Promise.allSettled([...16 hotspots...])
│     └─ GlobalAlert[] (filtrados por severidade)
│
└─ useESP32()
   └─ HTTP GET http://ESP32_IP/alert?level=X
      └─ Buzzer acionado
```

---

## 🧪 Desenvolvimento

### Estrutura Modular
Cada funcionalidade está isolada:
- `services/` → Lógica de API
- `utils/` → Cálculos
- `hooks/` → Estado
- `components/` → UI

### Adicionar Nova Localidade
Edite `src/constants/locations.ts`:
```typescript
municipalities: [
  { name: "Nova Cidade", lat: -X.XXXX, lon: XX.XXXX, admin1: "Província", country: "Angola" }
]
```

### Adicionar Novo Hotspot Global
Edite `src/constants/hotspots.ts`:
```typescript
{ name: "Cidade, País", lat: -X.XXXX, lon: XX.XXXX }
```

### Estender Funcionalidade
1. Crie novo hook em `hooks/`
2. Crie novo componente em `components/`
3. Integre em `LightningMonitor.tsx`

---

## 📋 Checklist de Funcionalidades

### Realtime Tab ✅
- [x] Seleção de localidade
- [x] Displayde CAPE e risco
- [x] 10 métricas
- [x] Previsão horária
- [x] Previsão diária
- [x] Botão ESP32

### Forecast Tab ✅
- [x] 16 hotspots simultâneos
- [x] Detecção de relâmpago
- [x] Detecção de calor
- [x] Filtro severidade
- [x] Gráfico CAPE

### ESP32 Tab ✅
- [x] Config IP
- [x] Simulação conexão
- [x] 4 alarmes pré-config
- [x] Log comunicação
- [x] Código Arduino

### Geral ✅
- [x] Dark mode
- [x] Responsivo
- [x] Sem dependências externas (CSS-in-JS)
- [x] TypeScript strict mode
- [x] Open-Meteo API

---

## 🚀 Deploy

### Vercel/Netlify
```bash
npm run build
# Deploy a pasta 'dist'
```

### GitHub Pages
```bash
# Configure em vite.config.ts
npm run build
git add dist
git commit -m "Deploy"
git push
```

---

## 📞 Suporte

### Problemas Comuns

**"ESP32 não responde"**
- Verifique IP correto
- Verifique conexão Wi-Fi
- Revise código Arduino

**"API sem dados"**
- Verifique coordenadas
- Verifique conexão internet
- Open-Meteo pode ter queda (raro)

**"Risco sempre mínimo"**
- É normal! Relâmpagos são eventos raros
- Vere em hotspots globais para exemplos

---

## 📚 Referências

- [Open-Meteo Docs](https://open-meteo.com/en/docs)
- [WMO Weather Codes](https://open-meteo.com/en/docs#weather_code)
- [CAPE Explicado](https://en.wikipedia.org/wiki/Convective_available_potential_energy)
- [ESP32 Docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)

---

**Versão:** 1.0.0  
**Autor:** Herculano PAP  
**Licença:** ISC  
**Last Updated:** 2026-03-30
