import { useState, useCallback, useEffect } from "react";
import { WeatherData } from "../types";
import { fetchWeather } from "../services/weatherService";
import { Location } from "../types";

export function useWeather(location: Location | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeather(location.lat, location.lon);
      setWeather(data);
    } catch (e: any) {
      setError(e.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    load();
  }, [load]);

  return { weather, loading, error, reload: load };
}
