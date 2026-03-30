/**
 * ARQUIVO DE REFERÊNCIA PARA SERVIDOR BACKEND
 * 
 * Este arquivo demonstra como implementar o endpoint /alerta em um servidor Node.js + Express
 * Salve este código em: backend/server.js ou servidor.js na sua aplicação
 * 
 * Instalação:
 * npm install express cors
 * 
 * Execução:
 * node servidor.js
 */

// ============================================
// OPÇÃO 1: Express + Node.js (Recomendado)
// ============================================

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Estado global de alerta do sistema
 * Estrutura:
 * {
 *   level: 0 (Sol) | 1 (Chuva) | 2 (Trovoada),
 *   weathercode: número WMO,
 *   cape: número J/kg,
 *   temperature: temperatura em °C,
 *   location: localidade,
 *   timestamp: timestamp de quando foi gerado,
 *   duration: duração do alerta em ms
 * }
 */
let currentAlert = {
  level: 0,
  weathercode: 0,
  cape: 0,
  temperature: 25,
  location: "Luanda",
  timestamp: Date.now(),
  duration: 0,
};

/**
 * ENDPOINT: GET /alerta
 * Consultado pelo ESP32 a cada 500ms
 * Retorna o estado atual de alerta
 */
app.get("/alerta", (req, res) => {
  // Verifica se o alerta ainda está válido (dentro da duração)
  const alertAge = Date.now() - currentAlert.timestamp;
  const isAlertActive = alertAge < currentAlert.duration;

  res.json({
    success: true,
    data: {
      level: isAlertActive ? currentAlert.level : 0, // Retorna 0 se expirou
      weathercode: currentAlert.weathercode,
      cape: currentAlert.cape,
      temperature: currentAlert.temperature,
      location: currentAlert.location,
      active: isAlertActive,
      remainingTime: Math.max(0, currentAlert.duration - alertAge), // ms restantes
      timestamp: currentAlert.timestamp,
    },
  });
});

/**
 * ENDPOINT: POST /alerta
 * Define um novo alerta no sistema
 * Corpo esperado:
 * {
 *   level: 0 | 1 | 2,
 *   weathercode: number,
 *   cape: number,
 *   temperature: number,
 *   location: string,
 *   duration: number (ms, padrão 180000 = 3 min)
 * }
 */
app.post("/alerta", (req, res) => {
  const { level, weathercode, cape, temperature, location, duration = 180000 } = req.body;

  // Validação
  if (![0, 1, 2].includes(level)) {
    return res.status(400).json({
      success: false,
      error: "Level deve ser 0 (Sol), 1 (Chuva) ou 2 (Trovoada)",
    });
  }

  if (!location || typeof location !== "string") {
    return res.status(400).json({
      success: false,
      error: "Location é obrigatória",
    });
  }

  // Atualiza estado global
  currentAlert = {
    level,
    weathercode: weathercode || 0,
    cape: cape || 0,
    temperature: temperature || 25,
    location,
    timestamp: Date.now(),
    duration: Math.max(1000, Math.min(600000, duration)), // Min 1s, max 10 min
  };

  console.log(`[SERVIDOR] Novo alerta: Nível ${level} em ${location}`);

  res.json({
    success: true,
    message: "Alerta definido com sucesso",
    data: currentAlert,
  });
});

/**
 * ENDPOINT: DELETE /alerta
 * Cancela o alerta atual
 */
app.delete("/alerta", (req, res) => {
  currentAlert = {
    level: 0,
    weathercode: 0,
    cape: 0,
    temperature: 25,
    location: "Nenhum",
    timestamp: Date.now(),
    duration: 0,
  };

  console.log("[SERVIDOR] Alerta cancelado");

  res.json({
    success: true,
    message: "Alerta cancelado",
  });
});

/**
 * ENDPOINT: GET /alerta/status
 * Retorna informações de status do sistema
 */
app.get("/alerta/status", (req, res) => {
  res.json({
    success: true,
    system: {
      serverTime: Date.now(),
      currentAlert: currentAlert,
      descriptions: {
        0: "☀️ Sol - Sem alertas",
        1: "🌧️ Chuva - Atenção",
        2: "⚡ Trovoada - Perigo",
      },
    },
  });
});

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    service: "Lightning Alert System",
    timestamp: Date.now(),
  });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor de Alertas rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoint GET  /alerta         → Consultado pelo ESP32 (a cada 500ms)`);
  console.log(`📡 Endpoint POST /alerta         → Define novo alerta`);
  console.log(`📡 Endpoint DELETE /alerta       → Cancela alerta`);
  console.log(`📡 Endpoint GET  /alerta/status  → Status do sistema`);
  console.log(`📡 Endpoint GET  /health         → Health check`);
});

// ============================================
// EXEMPLO DE USO CURL
// ============================================
/*
# Verificar estado de alerta (o que ESP32 vai fazer a cada 500ms)
curl http://localhost:3001/alerta

# Criar um novo alerta de chuva
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

# Criar um alerta de trovoada
curl -X POST http://localhost:3001/alerta \
  -H "Content-Type: application/json" \
  -d '{
    "level": 2,
    "weathercode": 95,
    "cape": 2500,
    "temperature": 20,
    "location": "Luanda",
    "duration": 300000
  }'

# Cancelar alerta
curl -X DELETE http://localhost:3001/alerta

# Ver status do sistema
curl http://localhost:3001/alerta/status

# Health check
curl http://localhost:3001/health
*/
