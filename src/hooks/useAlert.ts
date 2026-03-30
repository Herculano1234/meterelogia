import { useState, useEffect, useCallback } from "react";

export interface AlertState {
  level: 0 | 1 | 2; // 0: Sol, 1: Chuva, 2: Trovoada/Tempestade
  description: string;
  weathercode: number;
  cape: number;
  timestamp: number;
}

export interface UseAlertReturn {
  alert: AlertState;
  setAlert: (level: 0 | 1 | 2, weathercode: number, cape: number) => void;
  resetAlert: () => void;
  isRaining: boolean;
  isThunderstorm: boolean;
  isClear: boolean;
}

const DEFAULT_ALERT: AlertState = {
  level: 0,
  description: "Sol ☀️",
  weathercode: 0,
  cape: 0,
  timestamp: Date.now(),
};

/**
 * Hook para gerenciar estado de alerta do sistema
 * Sincroniza com o estado global de alertas
 * Valores: 0 = Sol, 1 = Chuva, 2 = Trovoada/Tempestade
 */
export function useAlert(): UseAlertReturn {
  const [alert, setAlertState] = useState<AlertState>(DEFAULT_ALERT);

  // Descrições dos níveis de alerta
  const descriptions: Record<0 | 1 | 2, string> = {
    0: "Sol ☀️",
    1: "Chuva 🌧️",
    2: "Trovoada/Tempestade ⚡",
  };

  /**
   * Define o nível de alerta baseado no código meteorológico e CAPE
   */
  const setAlert = useCallback((level: 0 | 1 | 2, weathercode: number, cape: number) => {
    const newAlert: AlertState = {
      level,
      description: descriptions[level],
      weathercode,
      cape,
      timestamp: Date.now(),
    };
    setAlertState(newAlert);
    console.log(`[ALERT] Nível: ${level} (${descriptions[level]}) | CAPE: ${cape} | WCode: ${weathercode}`);
  }, []);

  /**
   * Reseta o alerta para o estado padrão (Sol)
   */
  const resetAlert = useCallback(() => {
    setAlertState(DEFAULT_ALERT);
    console.log("[ALERT] Alerta resetado para padrão");
  }, []);

  /**
   * Determina o nível de alerta baseado no código meteorológico WMO
   * Retorna 0 (Sol), 1 (Chuva) ou 2 (Trovoada)
   */
  const determineAlertLevel = useCallback((weathercode: number, cape: number): 0 | 1 | 2 => {
    // Trovoada/Tempestade (códigos 80, 81, 82, 85, 86, 95, 96, 99)
    if ([80, 81, 82, 85, 86, 95, 96, 99].includes(weathercode)) {
      return 2;
    }

    // CAPE alto indica trovoada mesmo com outros códigos
    if (cape > 1500) {
      return 2;
    }

    // Chuva (códigos 45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 77, 80, 81, 82)
    if (
      [45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 77, 80, 81, 82, 85, 86].includes(weathercode)
    ) {
      return 1;
    }

    // Sol/Limpo
    return 0;
  }, []);

  return {
    alert,
    setAlert,
    resetAlert,
    isRaining: alert.level === 1,
    isThunderstorm: alert.level === 2,
    isClear: alert.level === 0,
  };
}
