import React from 'react';

interface RangeSliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
/** Range slider with a brand-filled track. */
export function RangeSlider(props: RangeSliderProps): React.ReactElement;
