interface LoadingProps {
  message?: string;
}

export function Loading({ message = "CARREGANDO..." }: LoadingProps) {
  return (
    <div style={{ textAlign: "center", padding: 60, color: "#1976D2" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>☁️</div>
      <div style={{ letterSpacing: 3 }}>{message}</div>
    </div>
  );
}
