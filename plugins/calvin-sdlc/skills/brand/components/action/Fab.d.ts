import React from 'react';

interface FabProps {
  /** Required icon node. */
  icon: React.ReactNode;
  /** Optional label — turns it into an extended (pill) FAB. */
  label?: string;
  intent?: 'color' | 'neutral';
  size?: 'm' | 'l';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}
/** Floating action button — circular, brand-filled, single primary action. */
export function Fab(props: FabProps): React.ReactElement;
