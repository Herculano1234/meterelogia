# 🌍 GUIA DE HOSPEDAGEM EM PRODUÇÃO

## ✅ Tudo Está Funcionando!

Seu projeto foi corrigido e está pronto para hospedagem. Aqui está como fazer:

---

## 🚀 Opção 1: Hospedagem Gratuita (Recomendado para Começar)

### Vercel (Frontend React) - Gratuito
```bash
npm install -g vercel
vercel login
vercel
```
- ✅ Frontend hospedado em 1 minuto
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Plano gratuito generoso

**Deploy:** https://vercel.com

---

## 🖥️ Opção 2: Backend em Produção

### Renderr (Node.js Backend) - Gratuito
```bash
1. Acesse https://render.com
2. Crie uma conta
3. Novo "Web Service"
4. Conecte seu repositório GitHub
5. Selecione "Node"
6. Build: npm install && npm install express cors
7. Start: node servidor.js
```

**Deploy:** https://render.com

---

## 🐳 Opção 3: Docker (Mais Profissional)

### Criar Dockerfile
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm install && npm install express cors

# Copiar código
COPY . .

# Build frontend
RUN npm run build

# Expor portas
EXPOSE 3001

# Iniciar servidor
CMD ["node", "servidor.js"]
```

### Deploy com Docker
```bash
docker build -t meu-app .
docker run -p 3001:3001 meu-app
```

---

## 📋 Checklist de Hospedagem

### ✅ Antes de fazer Deploy
- [ ] Rodou `npm run build` com sucesso
- [ ] Rodou `node servidor.js` sem erros
- [ ] Testou os endpoints com curl
- [ ] Verificou variáveis de ambiente
- [ ] Testou em localhost:3001 e localhost:5173
- [ ] Leu `CORRECAO_ERROS_HOSPEDAGEM.md`

### ✅ Configuração Necessária
- [ ] `package.json` com `"type": "module"`
- [ ] `servidor.js` usando ES6 imports
- [ ] Dependências instaladas (`npm install express cors`)
- [ ] `.gitignore` inclui `node_modules/`, `dist/`, `.env`
- [ ] Variáveis sensíveis em `.env` (não versionadas)

### ✅ Variáveis de Ambiente (.env)
```env
# .env (nunca versione isso!)
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://seu-frontend.vercel.app
```

---

## 🔐 Segurança para Produção

### 1. Adicionar CORS Restritivo
```javascript
// Em servidor.js
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
```

### 2. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições
});

app.use(limiter);
```

### 3. Validação de Entrada
```javascript
// Validar antes de processar
if (!level || ![0, 1, 2].includes(level)) {
  return res.status(400).json({ error: 'Invalid level' });
}
```

---

## 📊 Estrutura Recomendada para Produção

```
projeto/
├── src/                    ← Frontend React
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── dist/                   ← Build frontend (gerado por `npm run build`)
├── servidor.js             ← Backend (inicia em produção)
├── package.json            ← Dependências
├── vite.config.ts          ← Config frontend
├── tsconfig.json           ← Config TypeScript
├── .env                    ← Variáveis ambiente (NÃO versione!)
├── .gitignore              ← Arquivos ignorados
├── Dockerfile              ← Para docker
└── README.md               ← Instruções
```

---

## 🚀 Processo de Deploy Recomendado

### 1. Local (Verificação)
```bash
npm install express cors
npm run build
node servidor.js
# Testar em http://localhost:3001
```

### 2. Git (Versionamento)
```bash
git add .
git commit -m "Pronto para produção"
git push origin main
```

### 3. CI/CD (Automático)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install && npm install express cors
      - run: npm run build
```

### 4. Cloud (Hospedado)
- **Frontend:** Vercel → https://seu-app.vercel.app
- **Backend:** Render → https://seu-backend.onrender.com
- **Dados:** MongoDB Atlas (gratuito)

---

## 🌐 URLs de Produção

Após deploy:
```
Frontend: https://seu-app.vercel.app
Backend:  https://seu-backend.onrender.com
API:      https://seu-backend.onrender.com/alerta
```

Atualizar `useESP32.ts`:
```typescript
const API_URL = 'https://seu-backend.onrender.com';
```

---

## 🧪 Teste Final em Produção

```bash
# Frontend está acessível
curl https://seu-app.vercel.app

# Backend responde
curl https://seu-backend.onrender.com/health

# Endpoint de alerta funciona
curl https://seu-backend.onrender.com/alerta

# POST funciona
curl -X POST https://seu-backend.onrender.com/alerta \
  -H "Content-Type: application/json" \
  -d '{"level": 1, "weathercode": 61, "cape": 800, "temperature": 22, "location": "Luanda", "duration": 10000}'
```

---

## 📞 Planos de Hospedagem Comparação

| Serviço | Preço | Melhor Para | Link |
|---------|-------|-----------|------|
| Vercel | Gratuito | Frontend React | vercel.com |
| Netlify | Gratuito | Frontend estático | netlify.com |
| Render | Gratuito | Backend Node.js | render.com |
| Railway | Gratuito | Full-stack | railway.app |
| PythonAnywhere | Gratuito | Backend Python | pythonanywhere.com |
| DigitalOcean | $5-10 | Controle total | digitalocean.com |
| AWS | Gratuito 1yr | Profissional | aws.amazon.com |
| Heroku | Pago | Antes era gratuito | heroku.com |

---

## ⚡ Quick Start - Deploy em 5 Minutos

### Passo 1: Fork no GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

### Passo 2: Deploy Frontend (Vercel)
```bash
npm install -g vercel
vercel
# Selecione seu repo
```

### Passo 3: Deploy Backend (Render)
1. Vá para https://render.com
2. "New Web Service"
3. Conecte seu GitHub
4. Build: `npm install && npm install express cors`
5. Start: `node servidor.js`

### Passo 4: Conectar
Atualize `useESP32.ts` com URLs de produção

### Passo 5: Teste!
```bash
curl https://seu-backend.onrender.com/alerta
```

---

## 🎉 Pronto!

Seu sistema está:
- ✅ Desenvolvido localmente
- ✅ Versionado no Git
- ✅ Pronto para deploy
- ✅ Com CI/CD automático

**Próximo passo:** Faça o deploy agora! 🚀

---

**Dúvidas?** Veja:
- `CORRECAO_ERROS_HOSPEDAGEM.md` - Erros corrigidos
- `SISTEMA_ALERTA_ESP32.md` - Documentação técnica
- `GUIA_TESTES_ESP32.md` - Como testar
