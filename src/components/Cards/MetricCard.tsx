import { useTheme } from "../../context/ThemeContext";

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  sub: string;
}

export function MetricCard({ icon, label, value, sub }: MetricCardProps) {
  const { theme } = useTheme();
  
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: "clamp(12px, 3vw, 20px)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 8px 20px rgba(37, 99, 235, 0.15)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: "clamp(18px, 5vw, 28px)", marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: theme.primary, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: "clamp(16px, 4vw, 24px)", fontWeight: 700, color: theme.primary, margin: "4px 0" }}>
        {value}
      </div>
      <div style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: theme.textTertiary }}>{sub}</div>
    </div>
  );
}
