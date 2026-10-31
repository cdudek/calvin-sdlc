import React from 'react';

interface TextInputProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Helper / validation message shown below the field. */
  helper?: string;
  /** Validation state — drives border + message colour. */
  state?: 'none' | 'valid' | 'invalid';
  size?: 's' | 'm' | 'l';
  disabled?: boolean;
  /** Node before the input (icon, prefix). */
  prepend?: React.ReactNode;
  /** Node after the input (icon, clear button, counter). */
  append?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * Text field with label, helper text and validation states.
 * @startingPoint section="Forms" subtitle="Text input with label + validation" viewport="360x120"
 */
export function TextInput(props: TextInputProps): React.ReactElement;
