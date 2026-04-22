# 📋 CHECKLIST - ONZAJI v2.0 DEPLOYMENT

## ✅ FASE 1: Desenvolvimento Concluído

- [x] Frontend React com 4 abas
- [x] Backend Serverless Functions criadas
- [x] ESP32 v2.0 com HTTP integrado
- [x] Tema Light com ícones profissionais
- [x] vercel.json configurado com rewrites
- [x] CodigoEsp32.c apontando para Vercel
- [x] alertService.ts com URL correta
- [x] Documentação de deployment

## 🚀 FASE 2: Fazer Deploy Agora

### Etapa 2.1: Preparar Projeto
- [ ] Abrir terminal no projeto
- [ ] Executar: `npm run build`
- [ ] Verificar se `dist/` foi criado com sucesso

### Etapa 2.2: Conectar Vercel
- [ ] Instalar Vercel CLI: `npm i -g vercel`
- [ ] Fazer login: `vercel login`
- [ ] Deploy: `vercel`
- [ ] Selecionar projeto em https://vercel.com/dashboard

### Etapa 2.3: Verificar Deploy
- [ ] Acessar https://meterelogia.vercel.app
- [ ] Verificar se app carrega normalmente
- [ ] Abrir DevTools (F12) → Network
- [ ] Verificar se requisições vão para `/api/...`

## 🧪 FASE 3: Testar Integração

### Etapa 3.1: Testar Frontend
- [ ] Acessar https://meterelogia.vercel.app
- [ ] Clicar em cada aba (Tempo Real, Previsão, Alertas, Config)
- [ ] Tentar adicionar um dispositivo (Config → Dispositivos)
- [ ] Tentar adicionar emails (Config → Emails)

### Etapa 3.2: Testar ESP32
- [ ] Carregar novo código no ESP32:
  ```
  const char* SERVER_URL = "https://meterelogia.vercel.app/api";
  ```
- [ ] Abrir Serial Monitor
- [ ] Verificar mensagens:
  ```
  ✅ WiFi conectado!
  [10s] 📡 GET https://meterelogia.vercel.app/api/alerts/0001... ✅
  ```
- [ ] Se houver erro 404: Verificar vercel.json

### Etapa 3.3: Testar Sincronização
- [ ] No ESP32 Serial Monitor: Ver GET request bem-sucedido
- [ ] No App (Frontend): Ir para "🔔 Alertas"
- [ ] Aguardar 30 segundos (auto-refresh)
- [ ] Se houver alerta no ESP32, deve aparecer no app

## 📊 FASE 4: Monitoramento

### Etapa 4.1: Logs Vercel
- [ ] Ir para https://vercel.com/dashboard
- [ ] Selecionar projeto "meterelogia"
- [ ] Clicar em "Logs"
- [ ] Verificar requisições do ESP32 e App

### Etapa 4.2: Métricas
- [ ] Verificar: Analytics → Visitas
- [ ] Verificar: Deployments → Histórico
- [ ] Configurar: Alertas → Notificações

## 🔐 FASE 5: Segurança (Opcional)

- [ ] Adicionar rate limiting
- [ ] Configurar JWT para ESP32
- [ ] Ativar HTTPS everywhere
- [ ] Adicionar WAF (Web Application Firewall)

## 🗄️ FASE 6: Persistência (Opcional)

- [ ] Escolher banco de dados (Supabase/Firebase/MongoDB)
- [ ] Migrar código das functions para usar DB
- [ ] Configurar variáveis de ambiente no Vercel
- [ ] Testar novo fluxo

## 📱 FASE 7: Melhorias Futuras

- [ ] Adicionar notificações por email real
- [ ] Adicionar push notifications (Firebase)
- [ ] Dashboard de histórico de alertas
- [ ] Gráficos de CAPE ao longo do tempo
- [ ] Previsão por IA

---

## 🎯 Status Atual

```
Frontend:     ✅ PRONTO
Backend:      ✅ PRONTO
ESP32:        ✅ PRONTO
Integração:   ✅ PRONTO
Deploy:       ⏳ AGUARDANDO EXECUÇÃO
```

## 🚦 Próximo Passo Imediato

**Execute agora:**
```bash
cd c:\Users\Hércules\Downloads\herculano_pap\herculano_pap
npm run build
vercel
```

**Tempo estimado:** 5-10 minutos para fazer deploy

---

**Responsável:** GitHub Copilot
**Data:** 22 de Abril de 2026
**Versão:** 2.0
