import React from 'react';

interface AccordionItem { title: React.ReactNode; content: React.ReactNode; }
interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple sections open at once. */
  multi?: boolean;
  defaultOpen?: number[];
  divider?: boolean;
  style?: React.CSSProperties;
}
/**
 * Expandable section list.
 * @startingPoint section="Layout" subtitle="Accordion + divider" viewport="640x280"
 */
export function Accordion(props: AccordionProps): React.ReactElement;
