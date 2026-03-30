import React, { createContext, useContext, ReactNode } from "react";

export interface Theme {
  // Colors
  background: string;
  backgroundSecondary: string;
  foreground: string;
  foregroundSecondary: string;
  border: string;
  borderLight: string;
  
  // Semantic colors
  primary: string;
  primaryLight: string;
  
  success: string;
  warning: string;
  danger: string;
  info: string;
  
  // Surfaces
  card: string;
  cardHover: string;
  input: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
}

const lightTheme: Theme = {
  background: "#f8fafc",
  backgroundSecondary: "#f1f5f9",
  foreground: "#ffffff",
  foregroundSecondary: "#f8fafc",
  border: "#e2e8f0",
  borderLight: "#cbd5e1",
  
  primary: "#2563eb",
  primaryLight: "#60a5fa",
  
  success: "#22c55e",
  warning: "#f97316",
  danger: "#ef4444",
  info: "#06b6d4",
  
  card: "#ffffff",
  cardHover: "#f1f5f9",
  input: "#f1f5f9",
  
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textTertiary: "#94a3b8",
};

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = lightTheme;

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
}
