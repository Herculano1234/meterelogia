import { GlobalAlert } from "../../types";

interface AlertCardProps {
  alert: GlobalAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const colors = {
    extreme: "#ff1744",
    high: "#ff6d00",
    medium: "#ffd600",
    low: "#00e676",
  } as Record<string, string>;
  
  const icons = {
    lightning: "⚡",
    earthquake: "🌍",
    flood: "🌊",
    extreme_heat: "🔥",
    cyclone: "🌀",
  } as Record<string, string>;
  
  const color = colors[alert.severity];

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}12, rgba(240,247,255,0.7))`,
        border: `1px solid ${color}50`,
        borderRadius: 12,
        padding: 16,
        boxShadow: `0 2px 12px ${color}20`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 22 }}>{icons[alert.type]}</span>
        <span
          style={{
            fontSize: 10,
            padding: "3px 8px",
            borderRadius: 20,
            background: `${color}22`,
            color,
            border: `1px solid ${color}50`,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {alert.severity}
        </span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#0D47A1", marginBottom: 4 }}>
        {alert.location}
      </div>
      <div style={{ fontSize: 12, color: "#1565C0", marginBottom: 8 }}>
        {alert.description}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#1976D2",
        }}
      >
        <span>
          {alert.type === "lightning"
            ? "⚡"
            : alert.type === "extreme_heat"
            ? "🔥"
            : "⚠️"}{" "}
          {alert.value} {alert.unit}
        </span>
        <span style={{ color: "#5B7C99" }}>
          {alert.lat.toFixed(2)}°, {alert.lon.toFixed(2)}°
        </span>
      </div>
      {alert.cape !== undefined && (
        <div style={{ marginTop: 10 }}>
          <div style={{ height: 4, background: "rgba(100,150,200,0.1)", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (alert.cape / 4000) * 100)}%`,
                background: color,
                borderRadius: 2,
              }}
            />
          </div>
          <div style={{ fontSize: 10, color: "#5B7C99", marginTop: 3 }}>
            CAPE: {Math.round(alert.cape)} J/kg
          </div>
        </div>
      )}
    </div>
  );
}
