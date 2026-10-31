import React from 'react';

interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  style?: React.CSSProperties;
}
interface SpinnerProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}
/** Linear progress bar (brand fill). */
export function ProgressBar(props: ProgressBarProps): React.ReactElement;
/** Circular loading spinner. */
export function Spinner(props: SpinnerProps): React.ReactElement;
