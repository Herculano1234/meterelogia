# ONZAJI v2.0 - INFORMAÇÕES ESSENCIAIS

## 🔗 Links Importantes

### Frontend
- **Produção:** https://meterelogia.vercel.app
- **Local Dev:** http://localhost:5173
- **Build:** `npm run build` → gera `dist/`

### Backend API
- **Base URL (Prod):** https://meterelogia.vercel.app/api
- **Base URL (Dev):** http://localhost:3001/api
- **Dashboard:** https://vercel.com/dashboard

### ESP32
- **Firmware:** `CodigoEsp32.c`
- **WiFi SSID:** `onzanji`
- **WiFi Pass:** `1234567890`
- **ID Zona:** `0001` (Huambo)
- **Antena GPIO:** 35
- **Buzzer GPIO:** 34
- **LED GPIO:** 2

## 📡 Endpoints API

```
GET  /api/alerts?zoneId=0001              # Alertas por CAPE
POST /api/esp32/alert                     # Enviar descarga
GET  /api/esp32/devices                   # Listar dispositivos
POST /api/esp32/devices                   # Adicionar device
DELETE /api/esp32/devices/{id}            # Remover device
GET  /api/esp32/email-alerts              # Listar emails
POST /api/esp32/email-alerts              # Adicionar emails
DELETE /api/esp32/email-alerts/{id}       # Remover emails
```

## 🔐 Credenciais

```
GitHub:  [Seu username]
Vercel:  [Conectado via GitHub]
WiFi:    onzanji / 1234567890
ESP32:   ID: 0001
```

## 📊 Stack Tecnológico

```
Frontend:    React 19 + TypeScript + Vite + Lucide
Backend:     Node.js Serverless Functions (Vercel)
Hardware:    ESP32 (WiFi + Antena)
API:         REST HTTP JSON
Database:    In-Memory (Stateless)
Hosting:     Vercel.com
```

## 🚀 Deploy Rápido

```bash
# 1. Build
npm run build

# 2. Deploy
npm i -g vercel
vercel --prod

# 3. Aguardar ~2-3 minutos
# 4. Acessar: https://meterelogia.vercel.app
```

## 📁 Arquivos Chave

```
src/
├── LightningMonitor.tsx        # App principal
├── components/
│   ├── Navigation/BottomNavigation.tsx
│   ├── Tabs/
│   │   ├── RealtimeTab.tsx
│   │   ├── ForecastTab.tsx
│   │   ├── AlertsLocalTab.tsx
│   │   └── SettingsTab.tsx
│   └── Common/
│       ├── Header.tsx
│       ├── DynamicBackground.tsx
│       └── ...
├── services/alertService.ts    # API calls
└── context/ThemeContext.tsx    # Tema Light

api/
├── alerts.js                   # GET /api/alerts
├── esp32-alert.js             # POST /api/esp32/alert
├── esp32-devices.js           # Device management
└── esp32-email-alerts.js      # Email management

CodigoEsp32.c                   # Firmware ESP32 v2.0
vercel.json                     # Config com rewrites
servidor_v2.js                  # Dev server local
```

## ✅ Checklist Rápido

- [ ] `npm run build` passou sem erros
- [ ] `vercel` CLI instalado
- [ ] GitHub conectado ao Vercel
- [ ] `/api` folder com 4 arquivos
- [ ] `vercel.json` tem rewrites
- [ ] ESP32 tem novo código com URL Vercel
- [ ] Algum device foi configurado no app
- [ ] Build está em `dist/`

## 🧪 Testar Antes de Deploy

```bash
# Terminal 1: Backend dev
node servidor_v2.js

# Terminal 2: Frontend dev
npm run dev

# Terminal 3: Serial Monitor ESP32
# Verificar GET bem-sucedido
```

## 📈 Monitorando em Produção

1. **Logs Vercel:** https://vercel.com/dashboard → Project → Logs
2. **Analytics:** https://vercel.com/dashboard → Project → Analytics
3. **Errors:** Verificar console do browser (F12)
4. **Redeploy:** `vercel --prod` para forçar novo deploy

## 🔧 Variáveis de Ambiente (Futura)

```env
# .env.local (não commitar)
VITE_API_BASE=https://meterelogia.vercel.app/api
ESP32_AUTH_TOKEN=seu_token_aqui
SENDGRID_API_KEY=sua_chave_aqui
```

## 🆘 Suporte Rápido

| Problema | Solução |
|----------|---------|
| 404 em /api | Verificar `/api/*.js` existe + redeploy |
| CORS Error | Verificar CORS headers em functions |
| ESP32 não conecta | Verificar WiFi + URL + Serial logs |
| App não carrega | Ctrl+Shift+Delete cache + hard refresh |
| Dados não sincronizam | Functions são stateless - usar DB |

## 📞 Contato

- **GitHub:** seu_username
- **Vercel:** seu_email@example.com
- **Documentação:** Ver arquivos `.md` no projeto

---

**Versão:** 2.0  
**Status:** Production Ready ✅  
**Data:** 22 de Abril de 2026  
**Autor:** GitHub Copilot
