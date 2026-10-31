import React from 'react';

interface TooltipProps {
  label: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
/** Small inverse tooltip shown on hover/focus of its child trigger. */
export function Tooltip(props: TooltipProps): React.ReactElement;
