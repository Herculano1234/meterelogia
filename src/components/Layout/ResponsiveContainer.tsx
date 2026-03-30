import React, { ReactNode } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

/**
 * Container responsivo que se adapta a todos os dispositivos
 * - Mobile: < 640px (full width with padding)
 * - Tablet: 640px - 1024px (800px max width)
 * - Desktop: > 1024px (1200px max width)
 */
export function ResponsiveContainer({ children, style }: ResponsiveContainerProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        padding: "clamp(12px, 4vw, 24px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <style>{`
        @media (min-width: 640px) {
          .responsive-container {
            max-width: 800px;
            padding: clamp(16px, 5vw, 32px);
          }
        }
        @media (min-width: 1024px) {
          .responsive-container {
            max-width: 1200px;
            padding: clamp(24px, 6vw, 40px);
          }
        }
      `}</style>
      {children}
    </div>
  );
}

/**
 * Flex layout responsivo
 * Stacks vertically on mobile, horizontally on larger screens
 */
export function ResponsiveFlex({
  children,
  direction = "row",
  gap = 16,
  align = "center",
  justify = "flex-start",
  wrap = true,
  style,
}: {
  children: ReactNode;
  direction?: "row" | "column";
  gap?: number;
  align?: "center" | "flex-start" | "flex-end" | "stretch";
  justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around";
  wrap?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        gap: `${gap}px`,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Stack component para layouts verticais responsivos
 */
export function Stack({
  children,
  gap = 16,
  horizontal = false,
  style,
}: {
  children: ReactNode;
  gap?: number;
  horizontal?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        gap: `${gap}px`,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
