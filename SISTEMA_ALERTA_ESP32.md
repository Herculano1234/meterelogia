# 🔔 SISTEMA DE ALERTA DE TROVOADAS COM ESP32

## 📋 Visão Geral

Sistema completo de monitoramento de alertas de trovoadas que integra:
- **Frontend React**: Interface de monitoramento e controle
- **Backend Node.js + Express**: Gerenciamento de estado de alertas
- **Hardware ESP32**: Dispositivo que consulta alertas e aciona buzzer

### Fluxo de Dados

```
Weather Data (Open-Meteo API)
           ↓
    React Frontend
           ↓
    Backend /alerta Endpoint
           ↓
    ESP32 (polling 500ms)
           ↓
    Buzzer (GPIO 34)
```

---

## 🎯 Níveis de Alerta

| Nível | Nome | Condição | Buzzer | Duração |
|-------|------|----------|--------|---------|
| **0** | ☀️ Sol | CAPE < 500 J/kg | Nenhum | N/A |
| **1** | 🌧️ Chuva | CAPE 500-1500 ou WCode 45-75 | Bips simples (1s intervalo) | 3 seg |
| **2** | ⚡ Trovoada | CAPE > 1500 ou WCode 80-99 | Bips contínuos | 3 minutos |

---

## 🔧 Componentes do Sistema

### 1️⃣ Frontend React (SPA)

#### Arquivos principais:
- `src/hooks/useAlert.ts` - Hook para gerenciar estado de alerta
- `src/services/alertService.ts` - Lógica de cálculo de alertas
- `src/hooks/useESP32.ts` - Comunicação com ESP32
- `src/components/Tabs/ESP32Tab.tsx` - Interface de controle

#### Funcionalidades:
- Monitora dados meteorológicos via Open-Meteo API
- Calcula nível de alerta baseado em CAPE e código WMO
- Envia alertas para endpoint `/alerta` do backend
- Mostra status de conexão com ESP32
- Log em tempo real de comunicações

---

### 2️⃣ Backend Node.js + Express

#### Arquivo: `servidor.js`

#### Endpoints:

##### `GET /alerta`
Consultado pelo ESP32 a cada 500ms
```bash
curl http://localhost:3001/alerta
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "level": 0,
    "weathercode": 0,
    "cape": 0,
    "temperature": 25,
    "location": "Luanda",
    "active": false,
    "remainingTime": 0,
    "timestamp": 1234567890
  }
}
```

##### `POST /alerta`
Define um novo alerta
```bash
curl -X POST http://localhost:3001/alerta \
  -H "Content-Type: application/json" \
  -d '{
    "level": 2,
    "weathercode": 95,
    "cape": 2500,
    "temperature": 20,
    "location": "Luanda",
    "duration": 180000
  }'
```

##### `DELETE /alerta`
Cancela alerta atual
```bash
curl -X DELETE http://localhost:3001/alerta
```

##### `GET /alerta/status`
Status do sistema
```bash
curl http://localhost:3001/alerta/status
```

##### `GET /health`
Health check
```bash
curl http://localhost:3001/health
```

---

### 3️⃣ Hardware ESP32

#### Arquivo: `CodigoEsp32.c`

#### Hardware necessário:
- ESP32 (qualquer modelo com WiFi)
- Buzzer ativo (conectado no GPIO 34)
- Fonte de alimentação
- Conexão WiFi

#### Funcionamento:
1. Conecta à WiFi com credenciais configuradas
2. Faz polling ao endpoint `GET /alerta` a cada 500ms
3. Compara nível de alerta com estado anterior
4. Se houver mudança, aciona buzzer com padrão apropriado
5. Mantém buzzer ativo até expirar a duração do alerta
6. LED de status pisca para indicar estado

#### Padrões de Buzzer:

**Nível 0 (Sol):** Sem som
```
Buzzer: OFF
```

**Nível 1 (Chuva):** Bips simples com intervalo
```
Padrão: [BIP 100ms] - [SILÊNCIO 900ms] - repetir
Duração: 3 segundos
Tempo entre consultas: 500ms
```

**Nível 2 (Trovoada):** Bips contínuos
```
Padrão: [BIP 100ms] - [SILÊNCIO 100ms] - repetir
Duração: 3 minutos
Tempo entre consultas: 500ms
```

---

## 🚀 Instalação e Configuração

### Backend (Node.js)

1. **Instale dependências:**
```bash
npm install express cors
```

2. **Configure arquivo `servidor.js`:**
```javascript
const PORT = 3001;  // Porta padrão
```

3. **Inicie servidor:**
```bash
node servidor.js
```

**Saída esperada:**
```
✅ Servidor de Alertas rodando em http://localhost:3001
📡 Endpoint GET  /alerta         → Consultado pelo ESP32 (a cada 500ms)
📡 Endpoint POST /alerta         → Define novo alerta
📡 Endpoint DELETE /alerta       → Cancela alerta
📡 Endpoint GET  /alerta/status  → Status do sistema
📡 Endpoint GET  /health         → Health check
```

### ESP32 (Arduino IDE)

1. **Instale bibliotecas:**
   - Arduino IDE → Sketch → Include Library → Manage Libraries
   - Procure por `ArduinoJson` (versão 6.x)
   - WiFi e HTTPClient geralmente vêm pré-instalados

2. **Configure credenciais (`CodigoEsp32.c`):**
```cpp
const char* SSID = "SEU_WIFI_SSID";
const char* PASSWORD = "SUA_SENHA_WIFI";
const char* SERVER_URL = "http://192.168.1.100:3001/alerta";
```

3. **Configure pino do buzzer:**
```cpp
const int BUZZER_PIN = 34;  // GPIO 34 (ajuste conforme necessário)
```

4. **Upload do código:**
   - Arduino IDE → Select → Board → ESP32 Dev Module
   - Select → Port → COMx (ESP32)
   - Sketch → Upload

5. **Monitor Serial:**
   - Tools → Serial Monitor (115200 baud)

**Saída esperada:**
```
╔════════════════════════════════════════╗
║  ESP32 - SISTEMA DE ALERTA TROVOADAS   ║
║  Buzzer no Pino 34                     ║
╚════════════════════════════════════════╝

📡 Iniciando WiFi...
🔗 Conectando a SEU_WIFI_SSID............
✅ WiFi conectado!
   IP: 192.168.1.101
   RSSI: -52 dBm

✅ Sistema pronto!
```

### Frontend React

1. **Instale dependências (se não feito):**
```bash
npm install
```

2. **Configure URL do backend em `src/hooks/useESP32.ts`:**
```typescript
const SERVER_URL = "http://192.168.1.100:3001/alerta";
```

3. **Inicie frontend:**
```bash
npm run dev
```

---

## 📡 Protocolo de Comunicação

### Sequência Típica

```
1. Frontend detecta alerta (CAPE > 1500 ou WCode 95)
   └─→ Chama POST /alerta

2. Backend recebe POST /alerta
   └─→ Atualiza currentAlert
   └─→ Define timer de expiração (3 min)

3. ESP32 consulta GET /alerta (a cada 500ms)
   └─→ Recebe level: 2 (trovoada)
   └─→ Inicia buzzer com padrão contínuo

4. Buzzer mantém ativo por 3 minutos
   └─→ LED de status fica ligado durante alerta

5. Usuário clica botão de reset ou expira tempo
   └─→ Frontend chama DELETE /alerta
   └─→ Backend retorna level: 0
   └─→ Próxima consulta ESP32 desativa buzzer
```

---

## 🔍 Exemplos de Uso

### Teste do Backend

```bash
# Verificar estado atual
curl http://localhost:3001/alerta

# Criar alerta de chuva
curl -X POST http://localhost:3001/alerta \
  -H "Content-Type: application/json" \
  -d '{
    "level": 1,
    "weathercode": 61,
    "cape": 800,
    "temperature": 22,
    "location": "Luanda",
    "duration": 180000
  }'

# Criar alerta de trovoada (MÁXIMO NÍVEL)
curl -X POST http://localhost:3001/alerta \
  -H "Content-Type: application/json" \
  -d '{
    "level": 2,
    "weathercode": 95,
    "cape": 3000,
    "temperature": 18,
    "location": "Luanda",
    "duration": 300000
  }'

# Cancelar alerta
curl -X DELETE http://localhost:3001/alerta

# Ver status
curl http://localhost:3001/alerta/status
```

### Integração no React

```typescript
import { useESP32 } from "./hooks/useESP32";

function MyComponent() {
  const { esp32, sendAlert, log } = useESP32();

  const handleWeatherUpdate = (cape: number, weathercode: number) => {
    if (cape > 1500 || weathercode >= 95) {
      sendAlert(cape, weathercode, true); // auto = true
    }
  };

  return (
    <div>
      <p>ESP32 Status: {esp32.connected ? "✅ Online" : "❌ Offline"}</p>
      <button onClick={() => sendAlert(2500, 95)}>
        Teste Alerta
      </button>
      <pre>{log.join("\n")}</pre>
    </div>
  );
}
```

---

## ⚙️ Configurações Avançadas

### Mudar intervalo de polling do ESP32

Em `CodigoEsp32.c`:
```cpp
const unsigned long POLL_INTERVAL = 500;  // Altere para 1000ms (1s) etc
```

### Mudar duração padrão de alerta

Em `src/services/alertService.ts`:
```typescript
duration: number = 180000  // 3 minutos (180000 ms)
```

Ou na interface:
```typescript
duration: Math.max(1000, Math.min(600000, duration))  // Min 1s, max 10 min
```

### Adicionar novo nível de alerta

1. Altere enum em `src/hooks/useAlert.ts`
2. Adicione caso em `CodigoEsp32.c` na função `playBuzzerPattern()`
3. Atualize lógica de cálculo em `calculateAlertLevel()`

---

## 🐛 Troubleshooting

### ESP32 não conecta ao WiFi
- Verifique SSID e senha
- ESP32 deve estar na mesma rede que o backend
- Reinicie ESP32 (pressione botão reset ou BOOT)

### Buzzer não aciona
- Verifique GPIO 34 está conectado ao positivo do buzzer
- Teste GPIO com exemplo: `digitalWrite(BUZZER_PIN, HIGH)`
- Verifique se buzzer está recebendo alimentação

### Servidor não responde
- Verifique porta 3001 não está em uso: `netstat -an | grep 3001`
- Firewall pode estar bloqueando: adicione exceção
- Teste com curl: `curl http://localhost:3001/health`

### Frontend não conecta ao ESP32
- Verifique URL do servidor em `useESP32.ts`
- CORS pode estar bloqueado: verifique origem do request
- Console do navegador mostra erro? Verifique aba Network

---

## 📚 Referências

### Códigos WMO Weather
- 0-19: Céu limpo/nublado
- 45-48: Neblina
- 51-67: Chuva
- 71-77: Neve
- 80-82: Chuva com raios
- **95-99: Trovoadas** ⚡

### Valores de CAPE (Convective Available Potential Energy)
- 0-500: Sem convecção
- 500-1500: Risco baixo-moderado
- **1500-3000: Risco alto**
- **> 3000: Risco extremo**

### GPIOs Disponíveis no ESP32
- Entrada: 34, 35, 36, 39
- Saída: 2, 4, 5, 12-19, 21-23, 25-27, 32-33
- PWM: 2, 4, 5, 12-19, 21-23, 25-27, 32-33

---

## 🎓 Próximos Passos

1. ✅ Testar comunica
ção HTTP entre frontend e backend
2. ✅ Verificar upload de código no ESP32
3. ✅ Testar buzzer com padrões diferentes
4. ✅ Calibrar duração e sensibilidade de alertas
5. ⏳ Adicionar persistência de alertas em banco de dados
6. ⏳ Implementar HTTPS para maior segurança
7. ⏳ Adicionar múltiplos ESP32 simultâneos
8. ⏳ Criar dashboard de histórico de alertas

---

**Versão:** 1.0.0  
**Data:** 30 de Março de 2026  
**Status:** ✅ Completo
