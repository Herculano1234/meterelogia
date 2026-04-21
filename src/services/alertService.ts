/**
 * Gerenciador de estado de alerta global
 * Mantém o estado de alerta centralizado para ser consumido por ESP32 e UI
 * Níveis: 0 = Sol, 1 = Chuva, 2 = Trovoada/Tempestade
 */

export interface GlobalAlertState {
  level: 0 | 1 | 2;
  weathercode: number;
  cape: number;
  temperature: number;
  location: string;
  timestamp: number;
  duration: number; // duração do alerta em ms (para ESP32 saber quanto tempo acionar)
}

// Estado global (simulado aqui, em produção seria no servidor)
let currentAlert: GlobalAlertState = {
  level: 0,
  weathercode: 0,
  cape: 0,
  temperature: 25,
  location: "Luanda",
  timestamp: Date.now(),
  duration: 0,
};

// Listeners para mudanças de alerta
const listeners: Set<(alert: GlobalAlertState) => void> = new Set();

/**
 * Obtém o estado de alerta atual
 */
export function getAlertState(): GlobalAlertState {
  return { ...currentAlert };
}

/**
 * Define um novo estado de alerta
 */
export function setAlertState(
  level: 0 | 1 | 2,
  weathercode: number,
  cape: number,
  temperature: number,
  location: string,
  duration: number = 180000 // 3 minutos por padrão
): void {
  currentAlert = {
    level,
    weathercode,
    cape,
    temperature,
    location,
    timestamp: Date.now(),
    duration,
  };

  console.log(`[GLOBAL ALERT] Nível: ${level} | CAPE: ${cape} | Localização: ${location}`);

  // Notifica todos os listeners
  notifyListeners();
}

/**
 * Reseta o alerta para sol
 */
export function resetAlertState(): void {
  currentAlert = {
    level: 0,
    weathercode: 0,
    cape: 0,
    temperature: 25,
    location: "Padrão",
    timestamp: Date.now(),
    duration: 0,
  };
  notifyListeners();
}

/**
 * Subscreve a mudanças de alerta
 */
export function subscribeToAlerts(callback: (alert: GlobalAlertState) => void): () => void {
  listeners.add(callback);

  // Retorna função para desinscrever
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Notifica todos os listeners sobre mudança de alerta
 */
function notifyListeners(): void {
  listeners.forEach((callback) => {
    try {
      callback({ ...currentAlert });
    } catch (error) {
      console.error("[ALERT] Erro ao chamar listener:", error);
    }
  });
}

/**
 * Calcula o nível de alerta baseado em CAPE e código meteorológico
 * Returns: 0 (Sol), 1 (Chuva), 2 (Trovoada)
 */
export function calculateAlertLevel(weathercode: number, cape: number): 0 | 1 | 2 {
  // Trovoada/Tempestade (códigos WMO thunderstorm)
  if ([80, 81, 82, 85, 86, 95, 96, 99].includes(weathercode)) {
    return 2;
  }

  // CAPE alto (> 1500 J/kg) indica potencial de trovoada
  if (cape > 1500) {
    return 2;
  }

  // Chuva (códigos WMO precipitation)
  if (
    [45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 77, 80, 81, 82, 85, 86].includes(weathercode)
  ) {
    return 1;
  }

  // Sol/Céu limpo
  return 0;
}

/**
 * Retorna descrição amigável do nível de alerta
 */
export function getAlertDescription(level: 0 | 1 | 2): string {
  const descriptions = {
    0: "☀️ Sol - Sem alertas",
    1: "🌧️ Chuva - Atenção",
    2: "⚡ Trovoada - Perigo",
  };
  return descriptions[level];
}

/**
 * Retorna padrão de buzzer para o ESP32
 * "0" = sem som, "1" = aviso simples, "2" = alerta contínuo
 */
export function getBuzzerPattern(level: 0 | 1 | 2): string {
  const patterns = {
    0: "0", // Sem buzzer
    1: "1", // Uma série de bips curtos
    2: "2", // Série contínua de bips
  };
  return patterns[level];
}

/**
 * ─────────────────────────────────────────────────────
 * INTEGRAÇÃO COM BACKEND HTTP (ESP32)
 * ─────────────────────────────────────────────────────
 */

import { LocalAlert, ESP32Device, EmailAlert } from "../types";

const API_BASE = "https://meterelogia.vercel.app/api";

// Fetch alertas locais da zona
export async function fetchLocalAlerts(zoneId: string): Promise<LocalAlert[]> {
  try {
    const response = await fetch(`${API_BASE}/alerts/${zoneId}`);
    if (!response.ok) throw new Error("Falha ao buscar alertas");
    const data = await response.json();
    return data.alerts || [];
  } catch (error) {
    console.error("Erro ao buscar alertas locais:", error);
    return [];
  }
}

// Enviar alerta do ESP32
export async function sendESP32Alert(alert: {
  esp32Id: string;
  zone: string;
  cape: number;
  temperature: number;
  precipitation: number;
  antennaReading: number;
  hasLightning: boolean;
  description: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/esp32/alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alert),
    });
    return response.ok;
  } catch (error) {
    console.error("Erro ao enviar alerta ESP32:", error);
    return false;
  }
}

// Salvar configuração de ESP32
export async function saveESP32Device(device: ESP32Device): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/esp32/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "device", data: device }),
    });
    return response.ok;
  } catch (error) {
    console.error("Erro ao salvar ESP32:", error);
    return false;
  }
}

// Salvar configuração de emails
export async function saveEmailAlert(emailAlert: EmailAlert): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/esp32/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "email", data: emailAlert }),
    });
    return response.ok;
  } catch (error) {
    console.error("Erro ao salvar alerta de email:", error);
    return false;
  }
}

// Obter devices vinculados
export async function getDevices(): Promise<ESP32Device[]> {
  try {
    const response = await fetch(`${API_BASE}/esp32/devices`);
    if (!response.ok) throw new Error("Falha ao buscar dispositivos");
    const data = await response.json();
    return data.devices || [];
  } catch (error) {
    console.error("Erro ao buscar dispositivos:", error);
    return [];
  }
}

// Obter alertas de email
export async function getEmailAlerts(): Promise<EmailAlert[]> {
  try {
    const response = await fetch(`${API_BASE}/esp32/email-alerts`);
    if (!response.ok) throw new Error("Falha ao buscar alertas de email");
    const data = await response.json();
    return data.alerts || [];
  } catch (error) {
    console.error("Erro ao buscar alertas de email:", error);
    return [];
  }
}

// Deletar device
export async function deleteDevice(deviceId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/esp32/devices/${deviceId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Erro ao deletar dispositivo:", error);
    return false;
  }
}

// Deletar alerta de email
export async function deleteEmailAlert(alertId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/esp32/email-alerts/${alertId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Erro ao deletar alerta de email:", error);
    return false;
  }
}
