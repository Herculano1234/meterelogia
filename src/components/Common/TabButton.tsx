interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: 12,
        cursor: "pointer",
        fontSize: "clamp(13px, 2vw, 15px)",
        fontFamily: "inherit",
        fontWeight: isActive ? 700 : 500,
        letterSpacing: 0.5,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: isActive
          ? "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)"
          : "rgba(30, 41, 59, 0.6)",
        color: isActive ? "#60a5fa" : "rgba(203, 213, 225, 0.7)",
        boxShadow: isActive
          ? "0 0 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          : "0 2px 8px rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: isActive ? "rgba(59, 130, 246, 0.5)" : "rgba(59, 130, 246, 0.1)",
        position: "relative",
        overflow: "hidden",
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(30, 41, 59, 0.8)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(203, 213, 225, 0.9)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(30, 41, 59, 0.6)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(203, 213, 225, 0.7)";
        }
      }}
    >
      {label}
    </button>
  );
}
