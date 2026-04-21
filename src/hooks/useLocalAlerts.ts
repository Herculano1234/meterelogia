import { useState, useCallback, useEffect } from "react";
import { LocalAlert, ESP32Device, EmailAlert } from "../types";
import { fetchLocalAlerts, getDevices, getEmailAlerts } from "../services/alertService";

export function useLocalAlerts() {
  const [alerts, setAlerts] = useState<LocalAlert[]>([]);
  const [devices, setDevices] = useState<ESP32Device[]>([]);
  const [emailAlerts, setEmailAlerts] = useState<EmailAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch alertas da zona selecionada
  const loadAlerts = useCallback(async (zoneId: string = "Huambo") => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchLocalAlerts(zoneId);
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar alertas");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch devices
  const loadDevices = useCallback(async () => {
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (err: any) {
      console.error("Erro ao carregar dispositivos:", err);
    }
  }, []);

  // Fetch email alerts
  const loadEmailAlerts = useCallback(async () => {
    try {
      const data = await getEmailAlerts();
      setEmailAlerts(data);
    } catch (err: any) {
      console.error("Erro ao carregar alertas de email:", err);
    }
  }, []);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    loadAlerts("Huambo");
    loadDevices();
    loadEmailAlerts();

    const interval = setInterval(() => {
      loadAlerts("Huambo");
    }, 30000);

    return () => clearInterval(interval);
  }, [loadAlerts, loadDevices, loadEmailAlerts]);

  return {
    alerts,
    devices,
    emailAlerts,
    loading,
    error,
    reloadAlerts: loadAlerts,
    reloadDevices: loadDevices,
    reloadEmailAlerts: loadEmailAlerts,
  };
}
