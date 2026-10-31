import React from 'react';

interface AlertProps {
  /** Status. info (default, brand purple) · success · warning · error · neutral · reminder (clock). */
  type?: 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'reminder';
  /** Bold headline (text-headline-s). */
  headline?: string;
  /** Alias for headline. */
  title?: string;
  /** Body text (text-body-m). Alias: children. */
  message?: React.ReactNode;
  children?: React.ReactNode;
  /** Action node shown on the trailing edge (e.g. a BtnLink or Button). */
  action?: React.ReactNode;
  /** Tinted background (default true). false = plain surface with tinted border + text. */
  filled?: boolean;
  /** Remove the border. */
  solid?: boolean;
  /** Single-line, tight padding (p-2) with ellipsis. */
  condensed?: boolean;
  /** Flush-edge banner: drops radius + side borders on the given edge. */
  inline?: 'top' | 'middle' | 'bottom';
  style?: React.CSSProperties;
}

/**
 * MessageBanner — status message surface (icon + headline + message + action).
 * Faithful to OMR core-ui MessageBanner: rounded-lg, tinted by status.
 * @startingPoint section="Feedback" subtitle="Status message banner" viewport="520x120"
 */
export function Alert(props: AlertProps): React.ReactElement;
