import React from 'react';

interface TabItem { id: string; label: React.ReactNode; icon?: React.ReactNode; badge?: number | string; }
interface TabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (id: string) => void;
  size?: 'small' | 'medium' | 'large';
  /** true = brand-purple selection, false = neutral ink. */
  color?: boolean;
  style?: React.CSSProperties;
}
/**
 * Underline tab bar.
 * @startingPoint section="Navigation" subtitle="Tabs, breadcrumbs, pagination, stepper" viewport="700x120"
 */
export function Tabs(props: TabsProps): React.ReactElement;
