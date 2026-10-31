import React from 'react';

interface ProductCardProps {
  name: string;
  rating?: number;
  reviewCount?: number;
  logoUrl?: string;
  category?: string;
  ctaLabel?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
/**
 * OMR Reviews software listing card (blurred cover + overlapping logo).
 * @startingPoint section="OMR Reviews" subtitle="Software product card" viewport="280x300"
 */
export function ProductCard(props: ProductCardProps): React.ReactElement;
