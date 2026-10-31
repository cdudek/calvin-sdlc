import React from 'react';

interface Crumb { label: string; href?: string; }
interface BreadcrumbsProps {
  items: Crumb[];
  onNavigate?: (item: Crumb, index: number) => void;
  /** Collapse to a single "‹ back" crumb (parent) on narrow viewports. */
  shortOnMobile?: boolean;
  style?: React.CSSProperties;
}
/**
 * Breadcrumb trail; last item is the current page (black, not a link).
 * Bar with top+bottom hairlines, chevron-right separators, purple-500 links.
 */
export function Breadcrumbs(props: BreadcrumbsProps): React.ReactElement;
