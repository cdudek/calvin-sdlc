import React from 'react';

interface SelectOption { value: string; label: string; }
interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  /** Options as strings or { value, label } objects. */
  options?: (string | SelectOption)[];
  placeholder?: string;
  size?: 's' | 'm' | 'l';
  disabled?: boolean;
  error?: boolean;
  helper?: string;
  id?: string;
  style?: React.CSSProperties;
}
/** Select / dropdown field with a click-to-open option list. */
export function Select(props: SelectProps): React.ReactElement;
