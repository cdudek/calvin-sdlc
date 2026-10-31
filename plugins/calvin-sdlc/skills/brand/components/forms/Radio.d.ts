import React from 'react';

interface RadioProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
interface RadioCardProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
/** Single radio button with optional label + description. */
export function Radio(props: RadioProps): React.ReactElement;
/** Radio presented as a selectable card (brand tint + border when selected). */
export function RadioCard(props: RadioCardProps): React.ReactElement;
