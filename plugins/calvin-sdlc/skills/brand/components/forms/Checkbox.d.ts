import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  description?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
/** Checkbox with optional label/description, indeterminate + error states. */
export function Checkbox(props: CheckboxProps): React.ReactElement;
