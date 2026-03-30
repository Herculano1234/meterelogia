import { useState, useCallback } from "react";
import { GlobalAlert } from "../types";
import { fetchGlobalAlerts } from "../services/weatherService";

export function useGlobalAlerts() {
  const [alerts, setAlerts] = useState<GlobalAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGlobalAlerts();
      setAlerts(data);
    } catch (e) {
      console.error("Erro ao carregar alertas globais:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { alerts, loading, reload: load };
}
