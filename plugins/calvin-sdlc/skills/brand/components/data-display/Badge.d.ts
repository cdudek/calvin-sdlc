import React from 'react';

interface BadgeProps {
  /** Status / information label text. Present ⇒ renders the soft-rounded label form. */
  children?: React.ReactNode;
  /** Numeric count form (circular). Ignored when children are given. */
  count?: number | string;
  /** Cap the count, e.g. max=99 renders "99+". */
  max?: number;
  /** Bare dot indicator (no text). */
  dot?: boolean;
  /**
   * Label form: neutral · primary · secondary · success · error · warning.
   * Count / dot form: primary · neutral · error · success.
   */
  tone?: 'neutral' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  /** Label form only — outlined instead of filled. */
  outlined?: boolean;
  /** Label form only — uppercase label. */
  uppercase?: boolean;
  /** Label form only — leading icon node. */
  prefixIcon?: React.ReactNode;
  style?: React.CSSProperties;
}
/**
 * Non-interactive information carrier (status label · count · dot). Never
 * clickable — for interactive labels (filter / select / remove) use `Tag`.
 */
export function Badge(props: BadgeProps): React.ReactElement;
