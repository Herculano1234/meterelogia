import { useState, useEffect, useRef } from "react";
import { Location } from "./types";
import { ANGOLA_LOCATIONS } from "./constants/locations";
import { useWeather } from "./hooks/useWeather";
import { useGlobalAlerts } from "./hooks/useGlobalAlerts";
import { useESP32 } from "./hooks/useESP32";
import { useTheme } from "./context/ThemeContext";
import { Header } from "./components/Common/Header";
import { Footer } from "./components/Common/Footer";
import { RealtimeTab } from "./components/Tabs/RealtimeTab";
import { ForecastTab } from "./components/Tabs/ForecastTab";

export default function LightningMonitor() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"realtime" | "forecast">("realtime");
  const [selectedProvince, setSelectedProvince] = useState("Luanda");
  const [selectedMunicipality, setSelectedMunicipality] = useState<Location>(
    ANGOLA_LOCATIONS[0].municipalities[0]
  );

  // Hooks for weather data
  const { weather, loading: loadingWeather, error: weatherError, reload: reloadWeather } = useWeather(
    selectedMunicipality
  );

  // Hooks for global alerts
  const { alerts: globalAlerts, loading: loadingAlerts, reload: reloadAlerts } = useGlobalAlerts();

  // Hooks for ESP32 (auto-fetch, sem UI manual)
  const { sending: sendingESP } = useESP32();

  // Auto-refresh weather every 5 minutes
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (activeTab === "realtime") reloadWeather();
    }, 300000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTab, reloadWeather]);

  // Load global alerts when switching to forecast tab
  useEffect(() => {
    if (activeTab === "forecast" && globalAlerts.length === 0) {
      reloadAlerts();
    }
  }, [activeTab]);

  // Handle location change
  const handleLocationChange = (province: string, municipality: Location) => {
    setSelectedProvince(province);
    setSelectedMunicipality(municipality);
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)",
        minHeight: "100vh",
        color: theme.textPrimary,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Animated gradient background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.04) 0%, transparent 50%)
          `,
          transition: "all 0.3s ease",
        }}
      />

      {/* CSS Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 768px) {
          body { font-size: 14px; }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HEADER */}
        <Header activeTab={activeTab as "realtime" | "forecast" | "esp32"} onTabChange={(tab) => {
          if (tab !== "esp32") setActiveTab(tab as "realtime" | "forecast");
        }} esp32={{ ip: "", connected: sendingESP, lastPing: "", alarmSent: false }} />

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 16px" }}>
          {/* TAB: REALTIME */}
          {activeTab === "realtime" && (
            <RealtimeTab
              weather={weather}
              loadingWeather={loadingWeather}
              weatherError={weatherError}
              selectedMunicipality={selectedMunicipality}
              selectedProvince={selectedProvince}
              onLocationChange={handleLocationChange}
              onReload={reloadWeather}
              onSendAlert={() => {}}
              sendingAlert={sendingESP}
            />
          )}

          {/* TAB: FORECAST */}
          {activeTab === "forecast" && (
            <ForecastTab alerts={globalAlerts} loadingAlerts={loadingAlerts} onReload={reloadAlerts} />
          )}
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
