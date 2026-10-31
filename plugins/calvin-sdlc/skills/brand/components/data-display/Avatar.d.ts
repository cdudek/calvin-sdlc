import React from 'react';

interface AvatarProps {
  src?: string;
  /** Name — used for initials fallback + deterministic colour. */
  name?: string;
  /** Named size (xs–2xl) or explicit px. */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | number;
  /** Square (rounded-xs) for company logos; default circular. */
  square?: boolean;
  status?: 'online' | 'busy' | 'away';
  style?: React.CSSProperties;
}
/** Avatar with image / initials fallback and optional status dot. */
export function Avatar(props: AvatarProps): React.ReactElement;
