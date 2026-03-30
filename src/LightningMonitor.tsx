import { useState, useEffect, useRef } from "react";
import { Location } from "./types";
import { ANGOLA_LOCATIONS } from "./constants/locations";
import { useWeather } from "./hooks/useWeather";
import { useGlobalAlerts } from "./hooks/useGlobalAlerts";
import { useESP32 } from "./hooks/useESP32";
import { Header } from "./components/Common/Header";
import { Footer } from "./components/Common/Footer";
import { RealtimeTab } from "./components/Tabs/RealtimeTab";
import { ForecastTab } from "./components/Tabs/ForecastTab";
import { ESP32Tab } from "./components/Tabs/ESP32Tab";

export default function LightningMonitor() {
  const [activeTab, setActiveTab] = useState<"realtime" | "forecast" | "esp32">("realtime");
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

  // Hooks for ESP32
  const { esp32, ipInput, setIpInput, sending: sendingESP, log: espLog, connect, sendAlert } = useESP32();

  // Auto-refresh weather every 5 minutes when on realtime tab
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

  // Auto-alert ESP32 if high risk weather
  useEffect(() => {
    if (weather && (weather.cape > 500 || weather.weathercode >= 95)) {
      sendAlert(weather.cape, weather.weathercode, true);
    }
  }, [weather?.cape, weather?.weathercode]);

  // Handle location change
  const handleLocationChange = (province: string, municipality: Location) => {
    setSelectedProvince(province);
    setSelectedMunicipality(municipality);
  };

  // Handle ESP32 connect
  const handleESP32Connect = () => {
    connect(ipInput);
  };

  // Handle send ESP32 alert
  const handleSendESP32Alert = (cape: number, wcode: number, auto = false) => {
    sendAlert(cape, wcode, auto);
  };

  return (
    <div
      style={{
        fontFamily: "'Space Mono', 'Courier New', monospace",
        background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 40%, #ffffff 100%)",
        minHeight: "100vh",
        color: "#1a3a52",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(100,150,200,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100,150,200,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Cloud decorative */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 400,
          height: 400,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.08,
          fontSize: 400,
          lineHeight: 1,
        }}
      >
        ☁️
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {/* HEADER */}
        <Header activeTab={activeTab} onTabChange={setActiveTab} esp32={esp32} />

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
            onSendAlert={handleSendESP32Alert}
            sendingAlert={sendingESP}
          />
        )}

        {/* TAB: FORECAST */}
        {activeTab === "forecast" && (
          <ForecastTab alerts={globalAlerts} loadingAlerts={loadingAlerts} onReload={reloadAlerts} />
        )}

        {/* TAB: ESP32 */}
        {activeTab === "esp32" && (
          <ESP32Tab
            esp32={esp32}
            ipInput={ipInput}
            setIpInput={setIpInput}
            sending={sendingESP}
            log={espLog}
            onConnect={handleESP32Connect}
            onSendAlert={handleSendESP32Alert}
          />
        )}

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
