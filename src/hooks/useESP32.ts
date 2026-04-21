import { useState, useRef, useEffect } from "react";
import { ESP32Status } from "../types";
import { calculateAlertLevel, getAlertDescription, getBuzzerPattern } from "../services/alertService";

/**
 * Hook para gerenciar comunicação com ESP32 e sistema de alertas
 * Responsabilidades:
 * - Conectar/desconectar do ESP32
 * - Enviar alertas ao ESP32 via HTTP
 * - Manter log de comunicações
 * - Sincronizar estado de alerta
 */
export function useESP32() {
  const [esp32, setEsp32] = useState<ESP32Status>({
    connected: false,
    ip: "192.168.1.100",
    lastPing: "",
    alarmSent: false,
  });
  
  const [ipInput, setIpInput] = useState("192.168.1.100");
  const [sending, setSending] = useState(false);
  const [log, setLog] = useState<string[]>([
    "[INIT] Sistema de alerta ESP32 inicializado",
    "[INIT] Níveis de alerta: 0=Sol, 1=Chuva, 2=Trovoada",
    "[INIT] Polling: 500ms | Duração padrão: 3 min",
  ]);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Conecta ao ESP32 via HTTP (simula conexão real)
   */
  const connect = (ip: string) => {
    setEsp32((p) => ({ ...p, ip }));
    addLog(`[CONNECT] Iniciando conexão com ESP32 em ${ip}...`);
    
    setTimeout(() => {
      // Validação de IP
      const isValidIP = /^\d+\.\d+\.\d+\.\d+$/.test(ip);
      const connected = isValidIP;
      
      setEsp32((p) => ({ 
        ...p, 
        connected, 
        lastPing: new Date().toLocaleTimeString("pt-AO") 
      }));
      
      if (connected) {
        addLog(`✅ [SUCCESS] ESP32 conectado em ${ip}`);
        addLog(`📡 [INFO] Aguardando alertas via endpoint /alerta`);
      } else {
        addLog(`❌ [ERROR] IP inválido: ${ip}`);
      }
    }, 1200);
  };

  /**
   * Envia alerta ao ESP32
   * Cria um endpoint POST /alerta que o ESP32 vai consultar
   */
  const sendAlert = async (cape: number, wcode: number, auto = false) => {
    if (!esp32.connected) {
      addLog("❌ [ERROR] ESP32 não conectado!");
      return;
    }

    setSending(true);
    const alertLevel = calculateAlertLevel(wcode, cape);
    const buzzerPattern = getBuzzerPattern(alertLevel as 0 | 1 | 2);
    const description = getAlertDescription(alertLevel as 0 | 1 | 2);

    addLog(
      `[${auto ? "AUTO" : "MANUAL"}] Enviando alerta nível ${alertLevel}: ${description}`
    );
    addLog(`[DATA] CAPE: ${cape} J/kg | WCode: ${wcode} | Buzzer: ${buzzerPattern}`);

    try {
      // Simula envio ao servidor (em produção, seria POST /alerta)
      const response = await fetch(`http://${esp32.ip}:3001/alerta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level: alertLevel,
          weathercode: wcode,
          cape,
          temperature: Math.random() * 10 + 20, // Simula temperatura
          location: "Luanda",
          duration: 180000, // 3 minutos
        }),
      });

      if (response.ok) {
        addLog(`✅ [SUCCESS] Alerta enviado com sucesso (nível ${alertLevel})`);
        setEsp32((prev) => ({
          ...prev,
          alarmSent: true,
          lastPing: new Date().toLocaleTimeString("pt-AO"),
        }));
      } else {
        addLog(`⚠️  [WARNING] Resposta inesperada: ${response.status}`);
      }
    } catch (error) {
      addLog(`❌ [ERROR] Falha ao enviar: ${String(error)}`);
    } finally {
      setSending(false);
    }
  };

  /**
   * Função para adicionar logs (mantém apenas últimas 50 linhas)
   */
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("pt-AO");
    setLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  /**
   * Obtém score de risco para compatibilidade
   */
  const getRiskScore = (cape: number, wcode: number): number => {
    if (wcode >= 95 || cape > 3000) return 100;
    if (cape > 1500 || wcode >= 80) return 75;
    if (cape > 500 || wcode >= 61) return 45;
    if (cape > 100) return 20;
    return 5;
  };

  const getRiskLabel = (cape: number, wcode: number): string => {
    if (wcode >= 95 || cape > 3000) return "EXTREMO";
    if (cape > 1500 || wcode >= 80) return "ALTO";
    if (cape > 500 || wcode >= 61) return "MODERADO";
    if (cape > 100) return "BAIXO";
    return "MÍNIMO";
  };

  return {
    esp32,
    ipInput,
    setIpInput,
    sending,
    log,
    connect,
    sendAlert,
  };
}
