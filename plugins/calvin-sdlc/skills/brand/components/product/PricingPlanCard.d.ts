import React from 'react';

interface PricingPlanCardProps {
  name: string;
  price: string;
  period?: string;
  features?: string[];
  badge?: string;
  highlight?: boolean;
  /** CTA node (usually a Button). */
  cta?: React.ReactNode;
  style?: React.CSSProperties;
}
/** A single pricing tier; highlighted plans get the brand selection border. */
export function PricingPlanCard(props: PricingPlanCardProps): React.ReactElement;
