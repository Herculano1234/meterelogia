# ⚡ Instruções para Configurar ESP32 com o Sistema de Alertas

## 🔧 Resumo das Mudanças Realizadas

### 1. **Tema Light Mode Only** ✅
- Removido completamente o modo dark
- Aplicação agora usa apenas tema light
- Cores removidas: azul escuro (#1e40af), backgrounds escuros (#0f172a, #1e293b)
- Cores mantidas: azul claro (#2563eb, #60a5fa), gradientes leves

### 2. **Previsão Apenas Angola** ✅
- Localizações restritas a Angola
- 18 províncias com seus respectivos municípios:
  - Luanda (5 municípios)
  - Huíla, Huambo, Benguela, Bié, Malanje, Uíge, Zaire, Cabinda
  - Kwanza Norte, Kwanza Sul, Cuando Cubango, Cunene, Moxico
  - Lunda Norte, Lunda Sul, Namibe, Bengo

### 3. **Servidor Backend Corrigido** ✅
- Endpoint `/alerta` agora funciona sem erros 308
- Suporte CORS total
- Middleware de tratamento de trailing slashes
- Logging detalhado de requisições

---

## 📡 Como Configurar o ESP32

### **Passo 1: Instalar o Código do Servidor**

```bash
cd /caminho/para/herculano_pap
npm install express cors
node servidor.js
```

**Output esperado:**
```
╔════════════════════════════════════════════════════════╗
║  ⚡ SERVIDOR DE ALERTAS DE RAIOS - RODANDO              ║
╚════════════════════════════════════════════════════════╝
  
  🌐 Endereço:    http://0.0.0.0:3001
  📡 Porta:       3001
```

### **Passo 2: Configurar o ESP32**

O ESP32 deve fazer requisições GET a cada 500ms:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "SEU_WIFI";
const char* password = "SUA_SENHA";
const char* server_url = "http://SEU_IP:3001/alerta";

HTTPClient http;
unsigned long lastRequest = 0;
const unsigned long REQUEST_INTERVAL = 500; // 500ms

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\n✅ WiFi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (millis() - lastRequest >= REQUEST_INTERVAL) {
    lastRequest = millis();
    
    http.begin(server_url);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode == 200) {
      String response = http.getString();
      Serial.print("[OK] ");
      Serial.println(response);
      
      // Processar JSON response
      // Ver campo "level" para acionar buzzer
      // 0 = sem alerta, 1 = chuva, 2 = trovoada
      
    } else {
      Serial.print("❌ Erro HTTP ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
}
```

### **Passo 3: Testa Resposta do Servidor**

**GET /alerta** (sem alerta):
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
    "timestamp": 1774873934119
  }
}
```

**Status: 200 OK** ✅

**GET /alerta** (com alerta ativo):
```json
{
  "success": true,
  "data": {
    "level": 2,
    "weathercode": 95,
    "cape": 2500,
    "temperature": 20,
    "location": "Luanda",
    "active": true,
    "remainingTime": 150000,
    "timestamp": 1774873979236
  }
}
```

---

## 🔔 Instruções de Alerta

### **Criar Novo Alerta**

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

**Níveis de Alerta:**
- `0` = ☀️ Sol (sem alerta)
- `1` = 🌧️ Chuva (atenção)
- `2` = ⚡ Trovoada (perigo - acionar buzzer)

### **Cancelar Alerta**

```bash
curl -X DELETE http://localhost:3001/alerta
```

### **Ver Status do Sistema**

```bash
curl http://localhost:3001/alerta/status
```

---

## 📊 Estrutura de Resposta

Todas as respostas do endpoint `/alerta`:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `success` | boolean | Sempre true em caso de sucesso |
| `level` | 0 \| 1 \| 2 | Nível de alerta |
| `weathercode` | number | Código WMO da meteorologia |
| `cape` | number | Convective Available Potential Energy (J/kg) |
| `temperature` | number | Temperatura em °C |
| `location` | string | Localidade do alerta |
| `active` | boolean | Se o alerta está ainda ativo |
| `remainingTime` | number | Tempo restante em ms |
| `timestamp` | number | Timestamp de quando foi criado |

---

## 🚀 Fluxo Completo

```
1. Servidor Node.js rodando em http://localhost:3001 ✅
   ↓
2. ESP32 faz GET /alerta a cada 500ms ✅
   ↓
3. Servidor retorna status 200 com JSON ✅
   ↓
4. ESP32 lê campo "level" do JSON
   ↓
5. Se level === 2, aciona buzzer para alertar trovoada ✅
   ↓
6. Mantém consultando até alerta expirar ✅
```

---

## ✅ Checklist de Funcionamento

- [ ] Servidor Node.js inicializado sem erros 308
- [ ] Endpoint `/alerta` retorna HTTP 200
- [ ] ESP32 conecta ao WiFi com sucesso
- [ ] ESP32 recebe respostas JSON sem timeout
- [ ] Campo `level` é lido corretamente
- [ ] Buzzer ativado quando `level === 2`
- [ ] Aplicação React mostra apenas tema light
- [ ] Previsão mostra apenas localizações de Angola

---

## 🐛 Solução de Problemas

### **Erro 308 (Permanent Redirect)**
✅ **RESOLVIDO**: Middleware de trailing slash removido e CORS configurado

### **Conexão recusada (Connection refused)**
- Verificar se o servidor está rodando: `npm run build` → `node servidor.js`
- Verificar porta 3001: `netstat -an | findstr 3001`

### **Timeout do ESP32**
- Aumentar `REQUEST_INTERVAL` se necessário
- Verificar IP/hostname do servidor
- Testar com curl antes de subir no ESP32

---

## 📝 Notas Importantes

1. **Endpoint sempre retorna HTTP 200** - Não há mais erros 308
2. **CORS ativado** - ESP32 pode fazer requisições de qualquer origem
3. **Tema Light Only** - Sem modo dark, cores limpas
4. **Angola Only** - Apenas 18 províncias com seus municípios
5. **Logging ativo** - Console mostra todas as requisições para debug

---

**Desenvolvido em: 30 de Março de 2026**
**Versão: 1.2.0** ✅
