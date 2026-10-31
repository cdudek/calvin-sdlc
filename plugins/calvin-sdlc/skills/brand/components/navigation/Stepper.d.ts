import React from 'react';

interface StepperProps {
  steps: { label: string }[];
  /** 0-indexed active step; earlier steps show as complete. */
  current?: number;
  style?: React.CSSProperties;
}
/** Horizontal linear progress stepper. */
export function Stepper(props: StepperProps): React.ReactElement;
