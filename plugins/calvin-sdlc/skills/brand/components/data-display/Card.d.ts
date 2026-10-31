import React from 'react';

interface CardProps {
  /** Adds hover state-layer + pointer cursor. */
  interactive?: boolean;
  /** Shows the brand selection border. */
  selected?: boolean;
  /** Optional media node rendered flush at the top (image/cover). */
  media?: React.ReactNode;
  /** Optional footer row (actions). */
  footer?: React.ReactNode;
  /** Inner padding in px (default 24). */
  padding?: number;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
interface ChipProps {
  tone?: 'neutral' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  outlined?: boolean;
  uppercase?: boolean;
  prefixIcon?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
interface BadgeProps {
  count?: number | string;
  dot?: boolean;
  tone?: 'primary' | 'neutral' | 'error' | 'success';
  max?: number;
  style?: React.CSSProperties;
}
interface RatingStarsProps {
  value?: number;
  size?: number;
  dense?: boolean;
  showValue?: boolean;
  reviewCount?: number;
  style?: React.CSSProperties;
}

/**
 * Content container — elevated surface, hairline border, rounded-sm (core-ui CardBox).
 * @startingPoint section="Data display" subtitle="Card, chips, badges, rating" viewport="420x260"
 */
export function Card(props: CardProps): React.ReactElement;
/** Interactive tag — a pill, like core-ui TagChip. */
export function Chip(props: ChipProps): React.ReactElement;
/** Small numeric / status / dot badge that attaches to another element. */
export function Badge(props: BadgeProps): React.ReactElement;
/** Star rating 0–5 (yellow, supports halves). Rating display, not a control. */
export function RatingStars(props: RatingStarsProps): React.ReactElement;
