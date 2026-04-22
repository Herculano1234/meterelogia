/**
 * SERVIDOR BACKEND - ONZAJI v2.0
 * 
 * Funcionalidade:
 * - Recebe requisições HTTP do ESP32
 * - Gerencia alertas locais por zona
 * - Armazena configurações de dispositivos e emails
 * - Integra com Open-Meteo para previsões
 * 
 * Endpoints:
 * GET  /api/alerts/{zoneId}         - Alertas baseados em CAPE
 * POST /api/esp32/alert             - Recebe alerta de descarga
 * POST /api/esp32/settings          - Salva configurações
 * GET  /api/esp32/devices           - Obtém dispositivos
 * GET  /api/esp32/email-alerts      - Obtém alertas de email
 * DELETE /api/esp32/devices/{id}    - Deleta dispositivo
 */

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

// ============================================
// DADOS EM MEMÓRIA (Em produção usar DB)
// ============================================

let localAlerts = [];  // Alertas locais recebidos do ESP32
let esp32Devices = []; // Dispositivos ESP32 vinculados
let emailAlerts = [];  // Configurações de email por zona

// Dados de teste
const testAlerts = [];

// ============================================
// ENDPOINTS: ALERTAS LOCAIS
// ============================================

/**
 * GET /api/alerts/{zoneId}
 * Retorna alertas para uma zona específica
 * Integra com Open-Meteo para CAPE
 */
app.get("/api/alerts/:zoneId", async (req, res) => {
  const { zoneId } = req.params;
  
  console.log(`📍 Consultando alertas para zona: ${zoneId}`);

  try {
    // Busca device com esse ID
    const device = esp32Devices.find(d => d.id === zoneId);
    const zone = device?.zone || zoneId;

    // Busca alertas recentes dessa zona (últimos 30 minutos)
    const recentAlerts = localAlerts.filter(a => {
      const age = Date.now() - new Date(a.timestamp).getTime();
      return a.zone === zone && age < 30 * 60 * 1000;
    });

    // Retorna o alerta mais recente ou um padrão
    const latestAlert = recentAlerts.length > 0 ? recentAlerts[0] : {
      level: 0,
      cape: 0,
      temperature: 25,
      precipitation: 0,
      description: "Sem alertas",
      hasLightning: false,
    };

    res.json({
      success: true,
      data: latestAlert,
      zone,
      device: device?.name || "Desconhecido",
    });
  } catch (error) {
    console.error("❌ Erro ao buscar alertas:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar alertas",
    });
  }
});

// ============================================
// ENDPOINTS: ESP32 ALERTS
// ============================================

/**
 * POST /api/esp32/alert
 * Recebe alerta de descarga do ESP32
 */
app.post("/api/esp32/alert", (req, res) => {
  const { esp32Id, zone, cape, temperature, precipitation, antennaReading, hasLightning, description } = req.body;

  if (!esp32Id || !zone) {
    return res.status(400).json({ success: false, error: "ID e zona obrigatórios" });
  }

  const alert = {
    id: `${esp32Id}-${Date.now()}`,
    esp32Id,
    zone,
    timestamp: new Date().toISOString(),
    type: hasLightning ? "lightning" : "rain",
    cape: cape || 0,
    temperature: temperature || 0,
    precipitation: precipitation || 0,
    antennaReading: antennaReading || 0,
    hasLightning: hasLightning || false,
    severity: calculateSeverity(cape, hasLightning),
    description: description || "Alerta recebido do ESP32",
  };

  localAlerts.unshift(alert);  // Adiciona no início

  // Mantém apenas últimos 100 alertas
  if (localAlerts.length > 100) {
    localAlerts = localAlerts.slice(0, 100);
  }

  console.log(`⚡ Alerta recebido de ${esp32Id} (${zone}):`, alert);

  // Enviar notificações de email se configurado
  notifyEmails(alert);

  res.json({
    success: true,
    alert,
    message: `Alerta recebido e processado para ${zone}`,
  });
});

/**
 * POST /api/esp32/settings
 * Salva configurações (dispositivos e emails)
 */
app.post("/api/esp32/settings", (req, res) => {
  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({ success: false, error: "Tipo e dados obrigatórios" });
  }

  if (type === "device") {
    const existingIdx = esp32Devices.findIndex(d => d.id === data.id);
    if (existingIdx >= 0) {
      esp32Devices[existingIdx] = data;
    } else {
      esp32Devices.push(data);
    }
    console.log(`📡 Dispositivo ${data.id} salvo (${data.zone})`);
  } else if (type === "email") {
    const existingIdx = emailAlerts.findIndex(a => a.id === data.id);
    if (existingIdx >= 0) {
      emailAlerts[existingIdx] = data;
    } else {
      emailAlerts.push(data);
    }
    console.log(`📧 Alerta de email configurado para ${data.zone}`);
  }

  res.json({
    success: true,
    message: `${type} salvo com sucesso`,
  });
});

// ============================================
// ENDPOINTS: DISPOSITIVOS E EMAILS
// ============================================

/**
 * GET /api/esp32/devices
 */
app.get("/api/esp32/devices", (req, res) => {
  res.json({
    success: true,
    devices: esp32Devices,
    count: esp32Devices.length,
  });
});

/**
 * DELETE /api/esp32/devices/:id
 */
app.delete("/api/esp32/devices/:id", (req, res) => {
  const { id } = req.params;
  esp32Devices = esp32Devices.filter(d => d.id !== id);
  res.json({
    success: true,
    message: `Dispositivo ${id} removido`,
  });
});

/**
 * GET /api/esp32/email-alerts
 */
app.get("/api/esp32/email-alerts", (req, res) => {
  res.json({
    success: true,
    alerts: emailAlerts,
    count: emailAlerts.length,
  });
});

/**
 * DELETE /api/esp32/email-alerts/:id
 */
app.delete("/api/esp32/email-alerts/:id", (req, res) => {
  const { id } = req.params;
  emailAlerts = emailAlerts.filter(a => a.id !== id);
  res.json({
    success: true,
    message: `Alerta de email ${id} removido`,
  });
});

// ============================================
// ENDPOINTS: ALERTAS LOCAIS
// ============================================

/**
 * GET /api/local-alerts
 * Retorna todos os alertas locais
 */
app.get("/api/local-alerts", (req, res) => {
  const { zone, limit = 50 } = req.query;

  let filtered = localAlerts;
  if (zone) {
    filtered = filtered.filter(a => a.zone === zone);
  }

  res.json({
    success: true,
    alerts: filtered.slice(0, parseInt(limit)),
    total: filtered.length,
  });
});

/**
 * DELETE /api/local-alerts/:id
 */
app.delete("/api/local-alerts/:id", (req, res) => {
  const { id } = req.params;
  localAlerts = localAlerts.filter(a => a.id !== id);
  res.json({
    success: true,
    message: `Alerta ${id} removido`,
  });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get("/health", (req, res) => {
  res.json({
    status: "🟢 OK",
    timestamp: new Date().toISOString(),
    devices: esp32Devices.length,
    alerts: localAlerts.length,
  });
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function calculateSeverity(cape, hasLightning) {
  if (hasLightning || cape > 3000) return "extreme";
  if (cape > 1500) return "high";
  if (cape > 500) return "medium";
  return "low";
}

function notifyEmails(alert) {
  // Encontra configuração de email para a zona
  const emailConfig = emailAlerts.find(e => e.zone === alert.zone);
  
  if (!emailConfig || !emailConfig.enableLightningAlerts) {
    return;
  }

  console.log(`📬 Enviando notificações para ${emailConfig.emails.length} emails...`);
  
  // Aqui integraria um serviço de email como Nodemailer
  // Por agora apenas loga
  emailConfig.emails.forEach(email => {
    console.log(`   → ${email}`);
  });
}

// ============================================
// ERRO 404
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint não encontrado",
    path: req.path,
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║  🚀 SERVIDOR ONZAJI v2.0 INICIADO    ║");
  console.log(`║  PORT: ${PORT}                            ║`);
  console.log("║  Aguardando requisições do ESP32...   ║");
  console.log("╚════════════════════════════════════════╝\n");
});

export default app;
