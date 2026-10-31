import React from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  /** Centred label for an "or"-style separator (horizontal only). */
  label?: string;
  subtle?: boolean;
  style?: React.CSSProperties;
}
/** Thin rule; horizontal or vertical, with optional centred label. */
export function Divider(props: DividerProps): React.ReactElement;
