import React, { ReactNode, useId } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;
  style?: React.CSSProperties;
}

export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 12, tablet: 20, desktop: 24 },
  className,
  style,
}: ResponsiveGridProps) {
  const id = useId();
  const gridId = `responsive-grid-${id.replace(/:/g, "")}`;

  return (
    <>
      <style>{`
        .${gridId} {
          display: grid;
          grid-template-columns: repeat(${columns.mobile || 1}, 1fr);
          gap: ${gap.mobile || 12}px;
        }

        @media (min-width: 640px) {
          .${gridId} {
            grid-template-columns: repeat(${columns.tablet || 2}, 1fr);
            gap: ${gap.tablet || 20}px;
          }
        }

        @media (min-width: 1024px) {
          .${gridId} {
            grid-template-columns: repeat(${columns.desktop || 3}, 1fr);
            gap: ${gap.desktop || 24}px;
          }
        }
      `}</style>
      <div
        className={`${gridId} ${className || ""}`}
        style={{
          ...style,
        }}
      >
        {children}
      </div>
    </>
  );
}
