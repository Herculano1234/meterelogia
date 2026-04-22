import { useEffect, useState } from "react";

interface ESP32NotificationProps {
  isActive: boolean;
  message?: string;
}

export function ESP32Notification({ isActive, message = "ESP32: Alerta Nível 4 Enviado" }: ESP32NotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isActive);
    if (isActive) {
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <>
      <style>{`
        @keyframes slide-in-down {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-out-up {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-100%);
          }
        }

        @keyframes pulse-neon {
          0%, 100% {
            box-shadow: 0 0 10px rgba(255, 23, 68, 0.5), 0 0 20px rgba(255, 23, 68, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 23, 68, 0.8), 0 0 30px rgba(255, 23, 68, 0.5);
          }
        }

        .esp32-notification {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          animation: ${show ? "slide-in-down" : "slide-out-up"} 0.4s ease-out;
        }
      `}</style>

      {show && (
        <div className="esp32-notification">
          <div
            style={{
              background: "linear-gradient(135deg, #ff1744 0%, #ff3d00 100%)",
              backdropFilter: "blur(20px)",
              border: "2px solid #ff1744",
              borderRadius: 12,
              padding: "14px 24px",
              boxShadow: "0 0 20px rgba(255, 23, 68, 0.6), 0 8px 32px rgba(0, 0, 0, 0.3)",
              color: "#ffffff",
              fontSize: "clamp(13px, 2vw, 15px)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 12,
              animation: "pulse-neon 1.5s ease-in-out infinite",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 20, animation: "pulse 0.6s ease-in-out infinite" }}>🚨</span>
            {message}
            <span style={{ fontSize: 20, animation: "pulse 0.6s ease-in-out 0.3s infinite" }}>📡</span>
          </div>
        </div>
      )}
    </>
  );
}
