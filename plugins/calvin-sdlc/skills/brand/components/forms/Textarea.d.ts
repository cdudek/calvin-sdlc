import React from 'react';

interface TextareaProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  helper?: string;
  state?: 'none' | 'valid' | 'invalid';
  rows?: number;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
/** Multi-line text field (same chrome as TextInput). */
export function Textarea(props: TextareaProps): React.ReactElement;
