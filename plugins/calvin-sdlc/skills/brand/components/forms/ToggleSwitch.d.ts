import React from 'react';

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 's' | 'm';
  /** Fill colour when active. */
  color?: 'primary' | 'success' | 'error';
  label?: string;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
/** On/off toggle switch. */
export function ToggleSwitch(props: ToggleSwitchProps): React.ReactElement;
