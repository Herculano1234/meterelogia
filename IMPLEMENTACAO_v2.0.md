# 🚀 IMPLEMENTAÇÃO v2.0 - ALERTAS LOCAIS + ESP32 INTEGRADO

**Data:** 21 de Abril de 2026  
**Status:** ✅ Estrutura Implementada

---

## 📋 O QUE FOI IMPLEMENTADO

### 1. **✅ Bottom Navigation Modernizado**
- **Arquivo:** `src/components/Navigation/BottomNavigation.tsx`
- **Características:**
  - 4 abas: Tempo Real, Previsão, Alertas Locais, Configurações
  - Glassmorphism com backdropFilter
  - Badge de alerta vermelho pulsante
  - Ícones com efeito de brilho (glow)
  - Animações suaves de escala e cor

### 2. **✅ Menu Alertas Locais**
- **Arquivo:** `src/components/Tabs/AlertsLocalTab.tsx`
- **Características:**
  - Grid responsivo de alertas (móvel-friendly)
  - Cards com informações completas:
    - ⚡ CAPE (J/kg)
    - 🌡️ Temperatura (°C)
    - 🌧️ Precipitação (mm)
    - ⚡ Detecção de Descarga (Sim/Não)
    - 📡 Leitura de Antena (0-4095)
  - Código de severidade com cores
  - Modal com detalhes completos
  - Suporta alertas do ESP32 Huambo

### 3. **✅ Menu Configurações**
- **Arquivo:** `src/components/Tabs/SettingsTab.tsx`
- **Funcionalidades:**
  
  **a) Vincular ESP32 por ID:**
  - Adicionar novo dispositivo
  - ID único (ex: 0001)
  - Nome do dispositivo
  - Zona associada (Huambo, Luanda, etc.)
  - Status de conexão (🟢/🔴)
  - Remover dispositivo
  
  **b) Alertas por Email:**
  - Selecionar zona
  - Adicionar lista de emails
  - Checkboxes para tipos de alerta:
    - ⚡ CAPE
    - ⚡ Descarga
    - 🌧️ Chuva
  - Gerenciamento de listas

### 4. **✅ Tipos TypeScript Novos**
- **Arquivo:** `src/types/index.ts`
- **Tipos Adicionados:**
  ```typescript
  LocalAlert              // Alerta local do ESP32
  ESP32Device             // Dispositivo vinculado
  EmailAlert              // Configuração de emails por zona
  AlertThresholds         // Limites de alerta
  ```

### 5. **✅ Serviço de Alertas**
- **Arquivo:** `src/services/alertService.ts`
- **Funções Novas:**
  ```typescript
  fetchLocalAlerts()      // GET /api/alerts/{zoneId}
  sendESP32Alert()        // POST /api/esp32/alert
  saveESP32Device()       // Salvar device
  saveEmailAlert()        // Salvar emails
  getDevices()            // Listar devices
  getEmailAlerts()        // Listar emails
  deleteDevice()          // Remover device
  deleteEmailAlert()      // Remover email
  ```

### 6. **✅ Hook useLocalAlerts**
- **Arquivo:** `src/hooks/useLocalAlerts.ts`
- **Características:**
  - Auto-fetch a cada 30 segundos
  - Carrega alertas, devices e emails
  - Retorna estado loading/error
  - Função de reload manual

### 7. **✅ LightningMonitor.tsx Atualizado**
- **Mudanças:**
  - 4 abas: realtime | forecast | alerts_local | settings
  - Integração BottomNavigation
  - Renderização condicional das abas
  - Handlers para salvar/deletar devices e emails
  - Sincronização de estado global

### 8. **✅ Backend Node.js v2.0**
- **Arquivo:** `servidor_v2.js`
- **Endpoints Implementados:**
  
  ```javascript
  GET  /api/alerts/{zoneId}              // Retorna alerta por zona
  POST /api/esp32/alert                  // Recebe descarga do ESP32
  POST /api/esp32/settings               // Salva configurações
  GET  /api/esp32/devices                // Lista dispositivos
  DELETE /api/esp32/devices/{id}         // Remove device
  GET  /api/esp32/email-alerts           // Lista emails
  DELETE /api/esp32/email-alerts/{id}    // Remove email
  GET  /api/local-alerts                 // Todos os alertas
  GET  /health                           // Health check
  ```
  
  **Características:**
  - Armazena alertas em memória (MAX: 100)
  - Calcula severidade (low/medium/high/extreme)
  - Notificação de emails
  - Logging completo

### 9. **✅ Código ESP32 v2.0 Completo**
- **Arquivo:** `CodigoEsp32.c`
- **Novas Funcionalidades:**
  
  **a) ID Único:**
  - Vincula ESP32 à zona específica
  - Ex: ID "0001" = Huambo
  - Servidor sabe qual zone usar
  
  **b) Leitura Analógica de Antena:**
  - GPIO 35 (ADC)
  - Lê 0-4095
  - Threshold: 2000 para detectar descarga
  - Armazena 100 últimas leituras
  
  **c) Requisições HTTP:**
  - **GET:** `/api/alerts/{ID}` - Recebe alertas
  - **POST:** `/api/esp32/alert` - Envia descarga detectada
  
  **d) Controle Inteligente:**
  - Buzzer + LED baseado em CAPE
  - Ativa intensificado se descarga detectada
  - LED pisca 1x/seg (conectado)
  - LED pisca 5x/seg (desconectado)

---

## 🔄 FLUXO COMPLETO DO SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DE FUNCIONAMENTO                   │
└─────────────────────────────────────────────────────────────┘

1. ESP32 INICIA
   ├─ Conecta WiFi
   ├─ Começa loop de 10 seg
   └─ A cada 10 seg: GET /api/alerts/{ID}

2. SERVIDOR RESPONDE
   ├─ Verifica CAPE para zona (ex: Huambo)
   ├─ Verifica previsão de chuva
   ├─ Retorna JSON com:
   │  ├─ level (0/1/2)
   │  ├─ cape
   │  ├─ temperature
   │  ├─ precipitation
   │  └─ description
   └─ Se level > 0: ALERTA

3. ESP32 RECEBE ALERTA
   ├─ Nível 1 (Chuva): Buzzer 5 seg
   ├─ Nível 2 (Trovoada): Buzzer 60 seg
   ├─ LED fica ligado (status alerta)
   └─ Começa monitorar antena

4. ANTENA DETECTA DESCARGA
   ├─ Leitura > 2000
   ├─ Intensifica buzzer (100ms ON/OFF)
   ├─ POST /api/esp32/alert
   └─ Servidor registra descarga

5. SERVIDOR PROCESSA
   ├─ Cria LocalAlert
   ├─ Marca hasLightning = true
   ├─ Calcula severidade = "extreme"
   ├─ Envia notificações por email (se configurado)
   └─ Armazena em memória

6. FRONTEND ATUALIZA
   ├─ useLocalAlerts faz auto-refresh (30 seg)
   ├─ AlertsLocalTab renderiza novo alerta
   ├─ Badge vermelho pisca no menu
   ├─ Card mostra:
   │  ├─ ⚡ DESCARGA DETECTADA
   │  ├─ Leitura de antena
   │  ├─ CAPE e temperatura
   │  └─ Timestamp
   └─ Usuário vê em tempo real

7. USUÁRIO VINCA ESP32
   ├─ Va para "Configurações"
   ├─ Adiciona novo device
   ├─ ID: 0001
   ├─ Nome: "ESP32 Huambo"
   ├─ Zona: "Huambo"
   └─ Sistema vincula

8. USUÁRIO CONFIGURA EMAILS
   ├─ Va para "Configurações"
   ├─ Seleciona zona: Huambo
   ├─ Adiciona emails: email@example.com
   ├─ Ativa: ⚡ Descarga + 🌧️ Chuva
   └─ Próximos alertas notificam via email
```

---

## 📱 LAYOUT MOBILE (Bottom Navigation)

```
┌─────────────────────────────────────────┐
│  Header com informações gerais          │
├─────────────────────────────────────────┤
│                                         │
│  [CONTEÚDO DA ABA SELECIONADA]         │
│                                         │
│  - Realtime: Tempo real + municipios   │
│  - Forecast: Previsão global           │
│  - Alerts: Alertas locais do ESP32     │
│  - Settings: Config devices + emails   │
│                                         │
├─────────────────────────────────────────┤
│ ⚡  🌍  🔔  ⚙️                          │
│ Real Prev Alrt Config                  │
│ (Bottom Navigation - Fixed)            │
└─────────────────────────────────────────┘
```

---

## 🔧 ENDPOINTS API

### **GET /api/alerts/{zoneId}**
Consultado pelo ESP32 a cada 10 segundos.

**Request:**
```http
GET /api/alerts/0001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "level": 2,
    "cape": 2450,
    "temperature": 28.5,
    "precipitation": 5.2,
    "description": "Alerta de trovoada em Huambo",
    "hasLightning": false
  },
  "zone": "Huambo",
  "device": "ESP32 Huambo"
}
```

### **POST /api/esp32/alert**
Enviado quando ESP32 detecta descarga.

**Request:**
```json
{
  "esp32Id": "0001",
  "zone": "Huambo",
  "cape": 2450,
  "temperature": 28.5,
  "precipitation": 5.2,
  "antennaReading": 3200,
  "hasLightning": true,
  "description": "Descarga detectada pela antena"
}
```

**Response:**
```json
{
  "success": true,
  "alert": { ... },
  "message": "Alerta recebido e processado para Huambo"
}
```

---

## 📊 ESTRUTURA DE DADOS

### **LocalAlert**
```typescript
{
  id: string;                    // ID único
  esp32Id: string;               // ID do ESP32 (ex: "0001")
  zone: string;                  // Zona (ex: "Huambo")
  timestamp: string;             // ISO timestamp
  type: "lightning" | "rain" | "thunder" | "extreme_heat";
  cape: number;                  // J/kg
  precipitation: number;         // mm
  temperature: number;           // °C
  antennaReading: number;        // 0-4095
  hasLightning: boolean;         // Descarga detectada?
  severity: "low" | "medium" | "high" | "extreme";
  description: string;
}
```

### **ESP32Device**
```typescript
{
  id: string;                    // "0001"
  name: string;                  // "ESP32 Huambo"
  zone: string;                  // "Huambo"
  ip?: string;                   // IP do dispositivo
  connected: boolean;            // Status conexão
  lastConnection: string;        // ISO timestamp
  buzzerActive: boolean;
  ledActive: boolean;
}
```

### **EmailAlert**
```typescript
{
  id: string;                    // Identificador único
  zone: string;                  // "Huambo"
  emails: string[];              // ["email@example.com"]
  enableCapeAlerts: boolean;
  enableLightningAlerts: boolean;
  enableRainAlerts: boolean;
}
```

---

## 🚀 COMO USAR

### **1. Iniciar Backend (Local)**
```bash
node servidor_v2.js
# Servidor escuta em http://localhost:3001
```

### **2. Configurar ESP32**
- Altere `SSID` e `PASSWORD`
- Altere `ESP32_ID` (ex: "0001" para Huambo)
- Upload para ESP32
- ESP32 conecta e começa requisições

### **3. Acessar Frontend**
```bash
npm run dev
# Acessa http://localhost:5173
```

### **4. Vincular ESP32**
1. Va para "⚙️ Configurações"
2. Tab "📡 Dispositivos ESP32"
3. Adicione ID: 0001, Nome: ESP32 Huambo, Zona: Huambo
4. Clique "➕ Adicionar"

### **5. Configurar Emails**
1. Va para "⚙️ Configurações"
2. Tab "📧 Alertas por Email"
3. Selecione zona: Huambo
4. Adicione emails separados por vírgula
5. Clique "➕ Adicionar"

### **6. Testar Sistema**
1. ESP32 conecta e começa requisições
2. Se houver alerta no Huambo, buzzer ativa
3. Se antena detectar descarga (>2000), envia alerta
4. Frontend mostra em "🔔 Alertas"
5. Emails são notificados (se configurado)

---

## ⚠️ CONSIDERAÇÕES IMPORTANTES

### **Segurança**
- ⚠️ Backend em memória (não persistente)
- ⚠️ Sem autenticação (adicione JWT em produção)
- ⚠️ CORS aberto para todos (restringir em produção)
- ✅ Usar HTTPS em produção

### **Performance**
- ✅ Auto-refresh frontend: 30 segundos
- ✅ Poll ESP32: 10 segundos
- ✅ Máx 100 alertas em memória
- ✅ Sem database (usar SQLite/PostgreSQL)

### **Próximas Fases**
1. **Database:** Implementar SQLite ou PostgreSQL
2. **Email Real:** Nodemailer ou SendGrid
3. **Push Notifications:** Firebase Cloud Messaging
4. **Analytics:** Dashboard de histórico
5. **IA/ML:** Previsão de trovoadas

---

## 📞 ENDPOINTS RÁPIDA REFERÊNCIA

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/alerts/{zoneId} | Alerta por zona |
| POST | /api/esp32/alert | Enviar descarga |
| POST | /api/esp32/settings | Salvar config |
| GET | /api/esp32/devices | Listar devices |
| DELETE | /api/esp32/devices/{id} | Remover device |
| GET | /api/esp32/email-alerts | Listar emails |
| DELETE | /api/esp32/email-alerts/{id} | Remover email |
| GET | /api/local-alerts | Todos alertas |
| GET | /health | Status servidor |

---

**✅ Sistema Pronto para Testar!**
