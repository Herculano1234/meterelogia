# 🧪 GUIA DE TESTES - SISTEMA DE ALERTA ESP32

## 📋 Checklist de Testes

### Fase 1: Backend ✅

#### 1.1 Iniciar Servidor
```bash
# Terminal 1
cd herculano_pap
node servidor.js
```

**Esperado:**
```
✅ Servidor de Alertas rodando em http://localhost:3001
```

#### 1.2 Testar Endpoint GET /alerta (sem alerta)
```bash
curl http://localhost:3001/alerta
```

**Esperado:**
```json
{
  "success": true,
  "data": {
    "level": 0,
    "active": false,
    "remainingTime": 0
  }
}
```

#### 1.3 Testar POST /alerta (Chuva)
```bash
curl -X POST http://localhost:3001/alerta \
  -H "Content-Type: application/json" \
  -d '{"level": 1, "weathercode": 61, "cape": 800, "temperature": 22, "location": "Luanda", "duration": 10000}'
```

**Esperado:**
```json
{
  "success": true,
  "message": "Alerta definido com sucesso",
  "data": { "level": 1, ... }
}
```

#### 1.4 Testar POST /alerta (Trovoada)
```bash
curl -X POST http://localhost:3001/alerta \
  -H "Content-Type: application/json" \
  -d '{"level": 2, "weathercode": 95, "cape": 2500, "temperature": 18, "location": "Luanda", "duration": 10000}'
```

#### 1.5 Testar GET /alerta (com alerta ativo)
```bash
curl http://localhost:3001/alerta
```

**Esperado:**
```json
{
  "success": true,
  "data": {
    "level": 2,
    "active": true,
    "remainingTime": 9500
  }
}
```

#### 1.6 Aguardar expiração (10s)
Faça a mesma requisição após 10 segundos:
```bash
curl http://localhost:3001/alerta
```

**Esperado:**
```json
{
  "success": true,
  "data": {
    "level": 0,
    "active": false
  }
}
```

---

### Fase 2: ESP32 Firmware ✅

#### 2.1 Preparar Arduino IDE
- Instale ESP32 Board: File → Preferences → URLs adicionais
  ```
  https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
  ```
- Tools → Board → ESP32 Dev Module
- Tools → Port → COMx (seu ESP32)
- Tools → Upload Speed → 921600

#### 2.2 Instalar Bibliotecas
- Sketch → Include Library → Manage Libraries
- Procure: `ArduinoJson`
- Instale versão 6.21.2 ou superior

#### 2.3 Configurar Credenciais
Edite `CodigoEsp32.c`:
```cpp
const char* SSID = "SEU_WIFI";
const char* PASSWORD = "SUA_SENHA";
const char* SERVER_URL = "http://192.168.1.100:3001/alerta";  // Altere IP
```

#### 2.4 Upload do Firmware
- Sketch → Upload (Ctrl+U)
- Aguarde: `Leaving... Hard resetting via RTS pin`

#### 2.5 Monitorar Serial
- Tools → Serial Monitor (115200 baud)

**Esperado (saída serial):**
```
╔════════════════════════════════════════╗
║  ESP32 - SISTEMA DE ALERTA TROVOADAS   ║
║  Buzzer no Pino 34                     ║
╚════════════════════════════════════════╝

📡 Iniciando WiFi...
🔗 Conectando a SEU_WIFI............
✅ WiFi conectado!
   IP: 192.168.1.101
   RSSI: -52 dBm

✅ Sistema pronto!
```

#### 2.6 Verificar Polling
Observe a saída serial:
```
[5s] 📡 Consultando /alerta... ☀️  Sem alerta
[5s] 📡 Consultando /alerta... ☀️  Sem alerta
```

---

### Fase 3: Teste de Hardware ✅

#### 3.1 Testar Buzzer Sem Sistema
```cpp
// Adicione no setup()
digitalWrite(BUZZER_PIN, HIGH);
delay(1000);
digitalWrite(BUZZER_PIN, LOW);
```

Acariciar buzzer faz: BIP (1 segundo)

#### 3.2 Verificar LED de Status
- LED azul pisca lentamente = ESP32 OK, sem alerta
- LED azul pisca rápido = WiFi desconectado
- LED azul ligado contínuo = Alerta ativo

---

### Fase 4: Teste de Integração Completa ✅

#### 4.1 Teste: Nível 1 (Chuva)

**Terminal 1 (Backend):**
```bash
node servidor.js
```

**Terminal 2 (Criar alerta):**
```bash
curl -X POST http://localhost:3001/alerta \
  -H "Content-Type: application/json" \
  -d '{"level": 1, "weathercode": 61, "cape": 800, "temperature": 22, "location": "Luanda", "duration": 180000}'
```

**Esperado no ESP32:**
- Serial: `🔔 Ativando buzzer - CHUVA (3 seg)`
- Buzzer: BIP (100ms) - SILÊNCIO (900ms) - BIP (100ms) - ...
- Duração: ~3 segundos
- LED: Piscando rapidamente (4 bips/4s)

#### 4.2 Teste: Nível 2 (Trovoada)

**Terminal 2:**
```bash
curl -X POST http://localhost:3001/alerta \
  -H "Content-Type: application/json" \
  -d '{"level": 2, "weathercode": 95, "cape": 2500, "temperature": 18, "location": "Luanda", "duration": 180000}'
```

**Esperado no ESP32:**
- Serial: `🔔 Ativando buzzer - TROVOADA (3 min)`
- Buzzer: BIP (100ms) - SILÊNCIO (100ms) - BIP (100ms) - ... (contínuo)
- Duração: ~3 minutos (ou até cancelar)
- LED: Ligado contínuo durante alerta

#### 4.3 Teste: Cancelar Alerta

**Terminal 2:**
```bash
curl -X DELETE http://localhost:3001/alerta
```

**Esperado no ESP32:**
- Buzzer para imediatamente
- Serial: `☀️  Alerta cancelado - Sol`
- LED: Volta a piscar lentamente

---

### Fase 5: Teste Frontend React ✅

#### 5.1 Iniciar Frontend

**Terminal 3:**
```bash
npm run dev
```

Abra: http://localhost:5173

#### 5.2 Teste: Conectar ESP32

1. Vá para aba "📡 ESP32 Control"
2. Digite IP: `192.168.1.101` (do seu ESP32)
3. Clique "🔗 Conectar"

**Esperado:**
- ✅ Status muda para "ONLINE"
- Log mostra: `[CONNECT] Iniciando conexão...`
- Log mostra: `✅ [SUCCESS] ESP32 conectado em 192.168.1.101`

#### 5.3 Teste: Enviar Alerta Manual

1. Clique botão "⚠️ Atenção (PI)"

**Esperado:**
- Buzzer no ESP32 dispara (3 bips)
- Log mostra sucessos da comunicação
- Sensor de buzzer no Arduino

#### 5.4 Teste: Alerta Automático

1. Vá para aba "⚡ Tempo Real"
2. Selecione município
3. Simule dados meteorológicos (se possível)
4. Ou use ferramentas de desenvolvimento para forçar valores

---

### Fase 6: Teste de Reconexão ✅

#### 6.1 Desconectar WiFi

No ESP32:
```cpp
// Adicione ao handleButtonPress()
WiFi.disconnect(true);  // Desconecta e desativa WiFi
```

**Esperado:**
- LED pisca muito rápido (reconectando)
- Serial mostra tentativas de reconexão
- Status ESP32 no Frontend muda para OFFLINE

#### 6.2 Reconectar WiFi

- Pressione botão RESET no ESP32 OU
- Remova a linha de desconexão

**Esperado:**
- LED volta a piscar normalmente
- Status muda para ONLINE

---

### Fase 7: Teste de Stress ✅

#### 7.1 Múltiplos Alertas Rápidos

```bash
# Terminal 2 - Envie 5 alertas rápidos
for i in {1..5}; do
  curl -X POST http://localhost:3001/alerta \
    -H "Content-Type: application/json" \
    -d "{\"level\": $((i%2+1)), \"weathercode\": 95, \"cape\": 2000, \"temperature\": 20, \"location\": \"Luanda\", \"duration\": 5000}"
  sleep 1
done
```

**Esperado:**
- ESP32 não trava
- Buzzer responde a cada alerta
- Log não mostra erros

#### 7.2 Polling Contínuo

Deixe sistema rodando por 10 minutos:
- Monitor serial não mostra erros
- LED pisca consistentemente
- Consumo de memória estável

---

## 📊 Tabela de Verificação

| Teste | Backend | ESP32 | Frontend | Status |
|-------|---------|-------|----------|--------|
| GET /alerta (vazio) | ✅ | N/A | ✅ | |
| POST /alerta (L1) | ✅ | ✅ | ✅ | |
| POST /alerta (L2) | ✅ | ✅ | ✅ | |
| DELETE /alerta | ✅ | ✅ | ✅ | |
| Buzzer L1 (3 seg) | N/A | ✅ | N/A | |
| Buzzer L2 (3 min) | N/A | ✅ | N/A | |
| LED Status | N/A | ✅ | N/A | |
| Reconexão WiFi | N/A | ✅ | N/A | |
| Log Console | ✅ | ✅ | ✅ | |
| Stress Test | ✅ | ✅ | ✅ | |

---

## 🔧 Comandos Úteis para Debug

### Backend Debug
```bash
# Ver logs detalhados
NODE_DEBUG=* node servidor.js

# Testar conectividade
curl -v http://localhost:3001/alerta

# Monitorar porta em uso
netstat -an | grep 3001
```

### ESP32 Debug
```cpp
// Adicione ao código para debug detalhado
#define DEBUG 1
#if DEBUG
  #define dbg(x) Serial.println(x)
#else
  #define dbg(x)
#endif
```

### Frontend Debug
```javascript
// Console do navegador (F12)
fetch('http://localhost:3001/alerta')
  .then(r => r.json())
  .then(data => console.log(data))
```

---

## 📝 Relatório de Teste

Use este template para documentar seus testes:

```
Data: 30/03/2026
Tester: [Nome]
Hardware: ESP32 [modelo], Buzzer [marca]
WiFi: [SSID]

TESTES REALIZADOS:
□ Backend inicializa sem erros
□ GET /alerta retorna resposta válida
□ POST /alerta cria alerta
□ Buzzer Level 1 funciona (3 seg)
□ Buzzer Level 2 funciona (3 min)
□ LED de status funciona
□ Reconexão WiFi funciona
□ Frontend conecta ao ESP32
□ Teste de stress passou

PROBLEMAS ENCONTRADOS:
[Descrever aqui]

NOTAS:
[Adicionar observações]
```

---

**Próximo:** Após passar em todos os testes, sistema está pronto para produção! 🚀
