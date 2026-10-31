import React from 'react';

interface ButtonProps {
  /** Emphasis level. primary = filled solid, secondary = soft tint, outline = bordered. */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Semantic colour. color = brand purple (default), neutral = grey/ink, success, destructive. */
  intent?: 'color' | 'neutral' | 'success' | 'destructive';
  /** Size. Maps to fixed heights: xs 32 · s 40 · m 48 · l 64. */
  size?: 'xs' | 's' | 'm' | 'l';
  disabled?: boolean;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  /** Optional leading icon node (e.g. a Lucide <Icon/>). */
  prefixIcon?: React.ReactNode;
  /** Optional trailing icon node. */
  suffixIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * OMR semantic button. Any element that triggers an action (submit, open,
 * confirm). For navigation use BtnLink instead. rounded-md (6px) corners for xs/s, rounded-lg (8px) for m/l,
 * uppercase-free sentence-case labels, state-layer feedback on hover/press.
 *
 * @startingPoint section="Actions" subtitle="Primary / secondary / outline buttons" viewport="360x120"
 */
export function Button(props: ButtonProps): React.ReactElement;
