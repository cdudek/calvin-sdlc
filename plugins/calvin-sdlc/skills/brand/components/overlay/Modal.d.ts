import React from 'react';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  /** Called on Escape, overlay click, and close-button click. */
  onClose?: () => void;
  /** Footer action row (usually a Cancel + Confirm button pair). */
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** Dialog width in px (capped at 70% viewport). */
  width?: number;
  style?: React.CSSProperties;
}

/** Blocking modal dialog — blurred backdrop, centred rounded-lg surface. */
export function Modal(props: ModalProps): React.ReactElement | null;
