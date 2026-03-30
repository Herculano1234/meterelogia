import { RiskLevel } from "../../types";

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  sub: string;
}

export function MetricCard({ icon, label, value, sub }: MetricCardProps) {
  return (
    <div
      style={{
        background: "rgba(33,150,243,0.06)",
        border: "1px solid rgba(33,150,243,0.2)",
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#1976D2", letterSpacing: 1, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#0D47A1", margin: "4px 0" }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: "#5B7C99" }}>{sub}</div>
    </div>
  );
}
