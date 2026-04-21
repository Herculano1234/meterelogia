import React from "react";
import { Zap, Globe, Bell, Settings } from "lucide-react";

interface BottomNavigationProps {
  activeTab: "realtime" | "forecast" | "alerts_local" | "settings";
  onTabChange: (tab: "realtime" | "forecast" | "alerts_local" | "settings") => void;
  hasLocalAlerts?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  hasLocalAlerts = false,
}) => {
  const navItems = [
    { id: "realtime", label: "Tempo Real", icon: Zap },
    { id: "forecast", label: "Previsão", icon: Globe },
    { id: "alerts_local", label: "Alertas", icon: Bell },
    { id: "settings", label: "Config", icon: Settings },
  ] as const;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "80px",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as any)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "8px 12px",
              transition: "all 0.3s ease",
              color: activeTab === item.id ? "#3b82f6" : "#9ca3af",
              textDecoration: "none",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== item.id) {
                (e.currentTarget as HTMLElement).style.color = "#6b7280";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                activeTab === item.id ? "#3b82f6" : "#9ca3af";
            }}
          >
            <IconComponent
              size={24}
              strokeWidth={2}
              style={{
                transition: "all 0.3s ease",
              }}
            />
            {/* Badge de alerta para Alertas Locais */}
            {item.id === "alerts_local" && hasLocalAlerts && (
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  boxShadow: "0 0 8px rgba(239, 68, 68, 0.8)",
                  animation: "pulse 2s infinite",
                }}
              />
            )}
            <span
              style={{
                fontSize: "10px",
                fontWeight: "500",
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
                transition: "all 0.3s ease",
              }}
            >
              {item.label}
            </span>
            {activeTab === item.id && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  width: "20px",
                  height: "3px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "2px",
                  animation: "slideInUp 0.3s ease",
                }}
              />
            )}
          </button>
        );
      })}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </nav>
  );
};
