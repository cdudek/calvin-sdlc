import React from 'react';

interface IconProps {
  /** Lucide icon name (kebab or Pascal), e.g. "arrow-right", "star", "search". */
  name: string;
  /** Pixel size (square). Default 24. */
  size?: number;
  /** Stroke width. Default 2. */
  strokeWidth?: number;
  /** Explicit colour; otherwise inherits currentColor (use a text-icon-* class). */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Lucide icon wrapper — OMR's icon system. Renders a currentColor stroke icon.
 * Page must load the Lucide UMD script (window.lucide).
 */
export function Icon(props: IconProps): React.ReactElement;
