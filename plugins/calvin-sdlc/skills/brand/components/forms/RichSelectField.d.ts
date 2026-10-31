import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface RichSelectFieldProps {
  id?: string;
  label?: string;
  /** Selected value — a single value, or an array when `multiple`. */
  value?: string | number | Array<string | number>;
  /** Fires with the new value (single) or new array (multiple). */
  onChange?: (value: any) => void;
  options: SelectOption[];
  /** Multi-select mode — value becomes an array, selected rows show a check. */
  multiple?: boolean;
  /** Shows a clear (✕) affordance once something is selected. */
  clearable?: boolean;
  /** Adds a search input at the top of the dropdown. */
  searchable?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: 's' | 'm' | 'l';
  /** Validation state — drives border + trailing icon + message colour. */
  state?: 'none' | 'valid' | 'invalid';
  /** In multi-select, shows a purple count badge next to the value. */
  counter?: boolean;
  /** Helper / validation message below the field. */
  helper?: string;
  /** Max dropdown panel height in px (scrolls past it). */
  maxHeight?: number;
  /** Node before the value (icon/prefix). */
  prepend?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Fully custom select — form-field trigger + bordered dropdown, with optional
 * search, single/multi-select, clearable state, validation icons and full
 * keyboard navigation (↑ ↓ Enter Esc). Port of OMR's RichSelectField.
 * @startingPoint section="Forms" subtitle="Rich select — search, multi, validation" viewport="360x140"
 */
export function RichSelectField(props: RichSelectFieldProps): React.ReactElement;
