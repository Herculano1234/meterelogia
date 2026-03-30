interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ id, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 20px",
        border: "1px solid",
        borderColor: isActive ? "#2196F3" : "rgba(33,150,243,0.3)",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13,
        fontFamily: "inherit",
        background: isActive ? "rgba(33,150,243,0.12)" : "rgba(33,150,243,0.05)",
        color: isActive ? "#1976D2" : "#64B5F6",
        fontWeight: isActive ? 700 : 400,
        transition: "all 0.2s",
        letterSpacing: 1,
      }}
    >
      {label}
    </button>
  );
}
