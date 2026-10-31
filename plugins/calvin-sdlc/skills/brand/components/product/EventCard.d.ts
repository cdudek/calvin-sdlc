import React from 'react';

interface EventCardProps {
  title: string;
  day?: string;
  month?: string;
  location?: string;
  time?: string;
  tag?: string;
  image?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
/** Event / session tile with date chip, title, location and time. */
export function EventCard(props: EventCardProps): React.ReactElement;
