import { useState, useEffect, useRef } from "react";
import { Location, ESP32Device, EmailAlert } from "./types";
import { ANGOLA_LOCATIONS } from "./constants/locations";
import { useWeather } from "./hooks/useWeather";
import { useGlobalAlerts } from "./hooks/useGlobalAlerts";
import { useESP32 } from "./hooks/useESP32";
import { useLocalAlerts } from "./hooks/useLocalAlerts";
import { useTheme } from "./context/ThemeContext";
import { DynamicBackground } from "./components/Common/DynamicBackground";
import { ESP32Notification } from "./components/Common/ESP32Notification";
import { BottomNavigation } from "./components/Navigation/BottomNavigation";
import { Header } from "./components/Common/Header";
import { Footer } from "./components/Common/Footer";
import { RealtimeTab } from "./components/Tabs/RealtimeTab";
import { ForecastTab } from "./components/Tabs/ForecastTab";
import { AlertsLocalTab } from "./components/Tabs/AlertsLocalTab";
import { SettingsTab } from "./components/Tabs/SettingsTab";
import { saveESP32Device, saveEmailAlert, deleteDevice, deleteEmailAlert } from "./services/alertService";

export default function LightningMonitor() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"realtime" | "forecast" | "alerts_local" | "settings">("realtime");
  const [selectedProvince, setSelectedProvince] = useState("Huambo");
  const [selectedMunicipality, setSelectedMunicipality] = useState<Location>(
    ANGOLA_LOCATIONS.find(p => p.province === "Huambo")?.municipalities[0] || ANGOLA_LOCATIONS[0].municipalities[0]
  );
  const [showESP32Alert, setShowESP32Alert] = useState(false);
  const [devices, setDevices] = useState<ESP32Device[]>([]);
  const [emailAlerts, setEmailAlerts] = useState<EmailAlert[]>([]);

  // Hooks
  const { weather, loading: loadingWeather, error: weatherError, reload: reloadWeather } = useWeather(selectedMunicipality);
  const { alerts: globalAlerts, loading: loadingAlerts, reload: reloadAlerts } = useGlobalAlerts();
  const { sending: sendingESP } = useESP32();
  const { alerts: localAlerts, devices: fetchedDevices, emailAlerts: fetchedEmailAlerts, loading: loadingLocalAlerts, error: localAlertsError, reloadDevices, reloadEmailAlerts } = useLocalAlerts();

  // Auto-refresh weather
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

  // Sincronizar devices e emails
  useEffect(() => {
    setDevices(fetchedDevices);
    setEmailAlerts(fetchedEmailAlerts);
  }, [fetchedDevices, fetchedEmailAlerts]);

  // Handle ESP32 alert
  useEffect(() => {
    if (sendingESP) {
      setShowESP32Alert(true);
    }
  }, [sendingESP]);

  // Handle location change
  const handleLocationChange = (province: string, municipality: Location) => {
    setSelectedProvince(province);
    setSelectedMunicipality(municipality);
  };

  const handleSaveDevice = async (device: ESP32Device) => {
    await saveESP32Device(device);
    setDevices([...devices, device]);
    reloadDevices();
  };

  const handleSaveEmailAlert = async (emailAlert: EmailAlert) => {
    await saveEmailAlert(emailAlert);
    setEmailAlerts([...emailAlerts, emailAlert]);
    reloadEmailAlerts();
  };

  const handleDeleteDevice = async (deviceId: string) => {
    await deleteDevice(deviceId);
    setDevices(devices.filter(d => d.id !== deviceId));
  };

  const handleDeleteEmailAlert = async (alertId: string) => {
    await deleteEmailAlert(alertId);
    setEmailAlerts(emailAlerts.filter(a => a.id !== alertId));
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: theme.background,
        backgroundImage: `linear-gradient(135deg, ${theme.background} 0%, ${theme.backgroundSecondary} 100%)`,
        minHeight: "100vh",
        color: theme.textPrimary,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Dynamic weather background */}
      <DynamicBackground weathercode={weather?.weathercode || 0} />

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
        {/* ESP32 Notification */}
        <ESP32Notification isActive={showESP32Alert} />

        {/* HEADER */}
        <Header activeTab={activeTab as any} onTabChange={(tab: any) => {
          setActiveTab(tab);
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

          {/* TAB: ALERTAS LOCAIS */}
          {activeTab === "alerts_local" && (
            <AlertsLocalTab 
              alerts={localAlerts || []} 
              loading={loadingLocalAlerts || false}
              error={localAlertsError || ""}
            />
          )}

          {/* TAB: CONFIGURAÇÕES */}
          {activeTab === "settings" && (
            <SettingsTab
              devices={devices}
              emailAlerts={emailAlerts}
              onSaveDevice={handleSaveDevice}
              onSaveEmailAlert={handleSaveEmailAlert}
              onDeleteDevice={handleDeleteDevice}
              onDeleteEmailAlert={handleDeleteEmailAlert}
            />
          )}
        </div>

        {/* BOTTOM NAVIGATION */}
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasLocalAlerts={localAlerts && localAlerts.length > 0}
        />

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
