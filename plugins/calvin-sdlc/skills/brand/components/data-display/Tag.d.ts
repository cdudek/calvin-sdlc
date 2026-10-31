import React from 'react';

interface TagProps {
  children?: React.ReactNode;
  /** Make the tag clickable (filter / selectable facet). Adds hover, focus & keyboard support. */
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Show a remove (×) button and call this when clicked. */
  onRemove?: () => void;
  /** Brand "selected" state (e.g. an active filter). */
  selected?: boolean;
  prefixIcon?: React.ReactNode;
  style?: React.CSSProperties;
}
/**
 * Interactive label — filters, selectable facets, removable selections.
 * For a static, non-interactive information carrier (e.g. a status) use `Badge`.
 */
export function Tag(props: TagProps): React.ReactElement;
