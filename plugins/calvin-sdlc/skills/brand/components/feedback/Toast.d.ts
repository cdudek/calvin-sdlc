import React from 'react';

interface ToastProps {
  tone?: 'neutral' | 'success' | 'error' | 'info';
  message?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
}
/** Brief non-blocking notification on a dark inverse surface. */
export function Toast(props: ToastProps): React.ReactElement;
