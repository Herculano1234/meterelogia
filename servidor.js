import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Middleware para remover trailing slash
app.use((req, res, next) => {
  if (req.path !== "/" && req.path.endsWith("/")) {
    return res.redirect(301, req.path.slice(0, -1));
  }
  next();
});

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

  console.log(`[GET /alerta] Consulta recebida - Alerta ativo: ${isAlertActive}, Level: ${currentAlert.level}`);

  res.status(200).json({
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

  console.log(`[POST /alerta] Novo alerta recebido:`, { level, location, duration });

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

  console.log(`[SERVIDOR] ✅ Novo alerta: Nível ${level} em ${location}`);

  res.status(200).json({
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

  console.log("[SERVIDOR] ❌ Alerta cancelado");

  res.status(200).json({
    success: true,
    message: "Alerta cancelado",
  });
});

/**
 * ENDPOINT: GET /alerta/status
 * Retorna informações de status do sistema
 */
app.get("/alerta/status", (req, res) => {
  res.status(200).json({
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
  res.status(200).json({
    status: "online",
    service: "Lightning Alert System",
    timestamp: Date.now(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[ERRO]", err.message);
  res.status(500).json({
    success: false,
    error: err.message,
  });
});

// Inicia servidor
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  ⚡ SERVIDOR DE ALERTAS DE RAIOS - RODANDO              ║
╚════════════════════════════════════════════════════════╝
  
  🌐 Endereço:    http://0.0.0.0:${PORT}
  📡 Porta:       ${PORT}
  
  ENDPOINTS:
  ✅ GET    /alerta          → Consultado pelo ESP32 (a cada 500ms)
  ✅ POST   /alerta          → Define novo alerta
  ✅ DELETE /alerta          → Cancela alerta
  ✅ GET    /alerta/status   → Status do sistema
  ✅ GET    /health          → Health check
  
  EXEMPLO DE USO:
  curl http://localhost:${PORT}/alerta
  
  PARA ENVIAR ALERTA:
  curl -X POST http://localhost:${PORT}/alerta \\
    -H "Content-Type: application/json" \\
    -d '{"level": 2, "location": "Luanda", "duration": 180000}'
  
═══════════════════════════════════════════════════════════
  `);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n⛔ Encerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor encerrado");
    process.exit(0);
  });
});
