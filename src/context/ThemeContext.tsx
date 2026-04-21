import { createContext, useContext, ReactNode } from "react";

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
  background: "#ffffff",
  backgroundSecondary: "#f8fafc",
  foreground: "#ffffff",
  foregroundSecondary: "#f1f5f9",
  border: "#e5e7eb",
  borderLight: "#d1d5db",
  
  primary: "#3b82f6",
  primaryLight: "#60a5fa",
  
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  
  card: "#ffffff",
  cardHover: "#f9fafb",
  input: "#f3f4f6",
  
  textPrimary: "#1f2937",
  textSecondary: "#6b7280",
  textTertiary: "#9ca3af",
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
