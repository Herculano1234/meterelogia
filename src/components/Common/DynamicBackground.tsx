import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

interface DynamicBackgroundProps {
  weathercode: number;
}

export function DynamicBackground({ weathercode }: DynamicBackgroundProps) {
  const { theme } = useTheme();
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Use a lighter, subtler palette based on the theme to keep "light mode" soft
    const base = theme.background || "#ffffff";
    const secondary = theme.backgroundSecondary || "#f8fafc";

    if (weathercode >= 95) {
      // Trovoada — tons suaves, com leve escurecimento
      setBgStyle({
        background: `linear-gradient(135deg, ${secondary} 0%, ${base} 60%)`,
        backgroundSize: "200% 200%",
        animation: "bg-subtle-pulse 8s ease-in-out infinite",
        opacity: 0.95,
      });
    } else if (weathercode >= 61) {
      // Chuva — suaves azuis acinzentados
      setBgStyle({
        background: `linear-gradient(135deg, rgba(99,102,241,0.06) 0%, ${secondary} 40%, ${base} 100%)`,
        animation: "bg-subtle-move 12s ease-in-out infinite",
        opacity: 0.98,
      });
    } else if (weathercode >= 3) {
      // Nublado / parcial — leve azul pastel
      setBgStyle({
        background: `linear-gradient(135deg, rgba(14,165,233,0.06) 0%, ${secondary} 50%, ${base} 100%)`,
        animation: "bg-subtle-move 18s ease-in-out infinite",
        opacity: 0.98,
      });
    } else {
      // Ensolarado / padrão — muito suave e claro
      setBgStyle({
        background: `linear-gradient(135deg, ${secondary} 0%, ${base} 100%)`,
        animation: "bg-subtle-move 24s ease-in-out infinite",
        opacity: 1,
      });
    }
  }, [weathercode, theme]);

  return (
    <>
      <style>{`
        @keyframes bg-subtle-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes bg-subtle-pulse {
          0% { transform: scale(1); opacity: 0.98; }
          50% { transform: scale(1.01); opacity: 1; }
          100% { transform: scale(1); opacity: 0.98; }
        }

        .dynamic-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-size: 200% 200%;
          transition: background 0.8s ease-in-out, opacity 0.6s ease-in-out;
          pointer-events: none;
        }

        .bg-bubbles {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: radial-gradient(circle at 10% 20%, rgba(59,130,246,0.04) 0px, transparent 60px),
                             radial-gradient(circle at 80% 80%, rgba(99,102,241,0.03) 0px, transparent 80px);
          background-repeat: no-repeat;
          opacity: 0.9;
          mix-blend-mode: normal;
          transform: translateZ(0);
          animation: bubbles-move 30s linear infinite;
        }

        @keyframes bubbles-move {
          from { transform: translateY(0px) translateX(0px); }
          to { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>

      <div className="dynamic-bg" style={bgStyle} />
      <div className="bg-bubbles" />
    </>
  );
}
