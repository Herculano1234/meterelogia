# 🚀 GUIA DE DEPLOYMENT - ONZAJI v2.0

## Arquitetura Implementada

```
┌─────────────────────────────────────────────┐
│        FRONTEND (React + Vite)              │
│     Hospedado no Vercel (dist/)             │
│  https://meterelogia.vercel.app             │
└──────────────┬──────────────────────────────┘
               │
               ├─ HTTP Requests
               │
┌──────────────▼──────────────────────────────┐
│  BACKEND (Serverless Functions)             │
│      Vercel Functions (/api/)               │
│  https://meterelogia.vercel.app/api/...     │
└──────────────┬──────────────────────────────┘
               │
               ├─ HTTP GET/POST
               │
┌──────────────▼──────────────────────────────┐
│  ESP32 (Firmware C++)                       │
│  Conectado WiFi (onzanji)                   │
│  ID: 0001 (Zona: Huambo)                    │
└─────────────────────────────────────────────┘
```

## ✅ Estrutura Criada

```
/api/
├── alerts.js                    # GET /api/alerts?zoneId=0001
├── esp32-alert.js              # POST /api/esp32/alert
├── esp32-devices.js            # GET/POST/DELETE /api/esp32/devices
└── esp32-email-alerts.js       # GET/POST/DELETE /api/esp32/email-alerts

vercel.json                      # Configuração com rewrites
```

## 📋 Instruções de Deploy

### 1️⃣ **Preparar Projeto Local**

```bash
# Navegar para a pasta do projeto
cd c:\Users\Hércules\Downloads\herculano_pap\herculano_pap

# Instalar dependências (se necessário)
npm install

# Verificar build
npm run build

# Resultado esperado:
# ✓ built in 2.5s
```

### 2️⃣ **Push para GitHub**

```bash
# Inicializar git (se não estiver)
git init
git add .
git commit -m "Deploy ONZAJI v2.0 com Serverless Functions"
git push origin main
```

### 3️⃣ **Conectar ao Vercel**

**Opção A: Via CLI**
```bash
npm i -g vercel
vercel
# Seguir as instruções (conectar GitHub, selecionar projeto)
```

**Opção B: Via Dashboard**
- Ir para https://vercel.com/dashboard
- Clicar "Add New..."
- Selecionar "Project"
- Conectar repositório GitHub
- Vercel detectará automaticamente: Vite + Framework

### 4️⃣ **Configuração Automática**

Vercel vai:
1. ✅ Detectar `vercel.json`
2. ✅ Executar `npm run build` → gera `dist/`
3. ✅ Fazer deploy do frontend em `/`
4. ✅ Criar serverless functions em `/api/`
5. ✅ Aplicar rewrites automaticamente

## 🔗 URLs de Produção

Depois do deploy, os URLs serão:

```
Frontend:          https://meterelogia.vercel.app
Alertas:           https://meterelogia.vercel.app/api/alerts?zoneId=0001
ESP32 Alert:       https://meterelogia.vercel.app/api/esp32/alert
Dispositivos:      https://meterelogia.vercel.app/api/esp32/devices
Email Alerts:      https://meterelogia.vercel.app/api/esp32/email-alerts
```

## 📱 Testar Integração

### ESP32 vai fazer:
1. **GET** `https://meterelogia.vercel.app/api/alerts/0001` → Recebe alerta por CAPE
2. **POST** `https://meterelogia.vercel.app/api/esp32/alert` → Envia descarga detectada

### App vai fazer:
1. **GET** `/api/esp32/devices` → Listar dispositivos
2. **POST** `/api/esp32/devices` → Adicionar novo device
3. **POST** `/api/esp32/email-alerts` → Adicionar emails por zona

## ⚠️ Limitações Serverless (Vercel)

### ✅ Funciona:
- HTTP GET/POST/DELETE
- JSON parsing
- Variables globais (por execução)
- Requisições HTTP externas

### ❌ Não Funciona:
- **Persistência entre execuções** (cada função é stateless)
  - Solução: Usar banco de dados (Supabase, MongoDB, etc)
- **Conexões de longa duração** (máx 60 segundos)
  - Solução: Quebrar em múltiplas requisições

## 🗄️ Próxima Fase: Banco de Dados

### Opções recomendadas:

**1. Supabase (PostgreSQL)**
```bash
npm install @supabase/supabase-js
```
- Melhor para dados estruturados
- Gratuito até 500 MB

**2. Firebase Realtime DB**
- Melhor para alerts em tempo real
- Gratuito até 100 conexões simultâneas

**3. MongoDB Atlas**
```bash
npm install mongodb
```
- Melhor para dados flexíveis
- Gratuito até 512 MB

## 🧪 Testar Localmente (Antes de Deploy)

```bash
# Terminal 1: Backend local
node servidor_v2.js
# Server running on port 3001

# Terminal 2: Frontend
npm run dev
# http://localhost:5173

# Terminal 3: Serial Monitor (ESP32)
# Ver logs de conexão
```

## 🔐 Segurança (Para Produção)

```javascript
// Adicionar autenticação:
const authToken = process.env.ESP32_AUTH_TOKEN;

if (req.headers.authorization !== `Bearer ${authToken}`) {
  return res.status(401).json({ success: false, message: 'Unauthorized' });
}
```

## 📊 Monitoramento

Após deploy, você pode:
1. Ver logs em https://vercel.com/dashboard → Logs
2. Adicionar uptime monitoring (Pingdom, UptimeRobot)
3. Configurar alertas no GitHub quando deploy falhar

## ✨ Resultado Final

✅ **Frontend React** + **Backend Serverless** + **ESP32 Integrado** = **Sistema Completo**

Tudo funciona integrado no Vercel! 🎉
