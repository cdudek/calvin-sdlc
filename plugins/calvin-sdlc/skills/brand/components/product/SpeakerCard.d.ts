import React from 'react';

interface SpeakerCardProps {
  name: string;
  role?: string;
  topic?: string;
  image?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
/** OMR Festival speaker tile: avatar, name, role, talk topic. */
export function SpeakerCard(props: SpeakerCardProps): React.ReactElement;
