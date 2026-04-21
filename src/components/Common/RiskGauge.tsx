import { useTheme } from "../../context/ThemeContext";

interface RiskGaugeProps {
  icon: string;
  location: string;
  province: string;
  level: string;
  color: string;
  score: number;
  weatherLabel: string;
  cape: number;
  onAlert: () => void;
  isLoading: boolean;
}

export function RiskGauge({ icon, location, province, level, color, score, weatherLabel, cape, onAlert, isLoading }: RiskGaugeProps) {
  const { theme } = useTheme();
  const isExtreme = score >= 75;
  const isHigh = score >= 45;

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 ${color}66;
          }
          70% {
            box-shadow: 0 0 0 20px ${color}00;
          }
          100% {
            box-shadow: 0 0 0 0 ${color}00;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 15px ${color}88);
          }
          50% {
            filter: drop-shadow(0 0 25px ${color}cc);
          }
        }

        @keyframes float-up {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .risk-gauge {
          background: linear-gradient(135deg, ${color}22 0%, ${color}11 50%, ${theme.foreground} 100%);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: clamp(24px, 5vw, 40px);
          color: ${theme.textPrimary};
          position: relative;
          overflow: hidden;
          margin-bottom: 30px;
          border: 2px solid ${color}44;
          transition: all 0.3s ease;
          ${isExtreme ? `animation: pulse-ring 2s infinite;` : ""}
        }

        .risk-gauge:hover {
          border-color: ${color}88;
          transform: translateY(-2px);
        }

        .risk-number {
          font-size: clamp(56px, 12vw, 96px);
          font-weight: 900;
          color: ${color};
          line-height: 1;
          text-shadow: 0 0 20px ${color}66;
          ${isExtreme ? `animation: glow-pulse 2s ease-in-out infinite;` : ""}
        }

        .alert-btn {
          ${isExtreme ? `animation: float-up 2s ease-in-out infinite;` : ""}
        }
      `}</style>

      <div className="risk-gauge">
        {/* Decorative glow circle */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: `${color}22`,
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}>
            <div>
              <h2 style={{
                fontSize: "clamp(20px, 5vw, 32px)",
                margin: 0,
                fontWeight: 800,
                color: theme.textPrimary,
              }}>
                {location}
              </h2>
              <p style={{
                opacity: 0.7,
                fontSize: "clamp(12px, 2vw, 14px)",
                letterSpacing: 2,
                margin: "4px 0 0 0",
                textTransform: "uppercase",
              }}>
                {province}
              </p>
            </div>
            <div style={{
              fontSize: "clamp(48px, 12vw, 80px)",
              filter: "drop-shadow(0 0 10px rgba(0,0,0,0.2))",
            }}>
              {icon}
            </div>
          </div>

          {/* Main risk display */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: "clamp(12px, 1.5vw, 14px)",
              color: theme.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}>
              Nível de Risco
            </div>
            <div className="risk-number">{level}</div>
            <p style={{
              margin: "12px 0 0 0",
              fontSize: "clamp(13px, 2vw, 15px)",
              color: theme.textSecondary,
            }}>
              {weatherLabel} • CAPE: {Math.round(cape)} J/kg
            </p>
          </div>

          {/* Progress bar with gradient */}
          <div style={{ marginTop: 24, marginBottom: 24 }}>
            <div style={{
              height: 8,
              background: "rgba(0,0,0,0.2)",
              borderRadius: 10,
              overflow: "hidden",
              border: `1px solid ${color}44`,
            }}>
              <div style={{
                height: "100%",
                width: `${score}%`,
                background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                borderRadius: 10,
                transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: `0 0 10px ${color}88`,
              }} />
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "clamp(10px, 1.2vw, 12px)",
              marginTop: 8,
              fontWeight: 600,
              color: theme.textSecondary,
            }}>
              <span>SEGURO</span>
              <span>{score}%</span>
              <span>CRÍTICO</span>
            </div>
          </div>

          {/* Alert button */}
          {isHigh && (
            <button
              className="alert-btn"
              onClick={onAlert}
              style={{
                width: "100%",
                padding: "clamp(12px, 2vw, 16px)",
                borderRadius: 12,
                border: "none",
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "clamp(13px, 2vw, 15px)",
                cursor: "pointer",
                boxShadow: `0 8px 20px ${color}44, 0 0 15px ${color}33`,
                textTransform: "uppercase",
                letterSpacing: 1,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = `0 12px 30px ${color}66, 0 0 25px ${color}55`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = `0 8px 20px ${color}44, 0 0 15px ${color}33`;
              }}
            >
              {isLoading ? "🔄 ENVIANDO..." : "🚨 DISPARAR ALERTA ESP32"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
