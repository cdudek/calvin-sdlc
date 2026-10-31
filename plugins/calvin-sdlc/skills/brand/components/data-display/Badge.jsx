import React from 'react';

/* Solid tones — for the circular count / dot notification indicator. */
const SOLID = {
  primary:  ['var(--background-color-primary-main)', 'var(--text-color-inverse)'],
  neutral:  ['var(--background-color-surface-inverse)', 'var(--text-color-inverse)'],
  error:    ['var(--border-color-error)', 'var(--text-color-inverse)'],
  success:  ['var(--graphic-color-success)', 'var(--text-color-inverse)'],
};

/* Subtle tones — for the status / information label (soft-rounded rectangle). */
const SUBTLE = {
  neutral:   { bg: 'var(--background-color-surface-elevation-3)', fg: 'var(--text-color-main)', bd: 'var(--border-color-main)' },
  primary:   { bg: 'var(--background-color-primary-subtle)', fg: 'var(--text-color-selected)', bd: 'var(--border-color-selected)' },
  secondary: { bg: 'var(--background-color-secondary-subtle)', fg: 'var(--text-color-warning)', bd: 'var(--border-color-secondary)' },
  success:   { bg: 'var(--background-color-success-subtle)', fg: 'var(--text-color-success)', bd: 'var(--border-color-success-subtle)' },
  error:     { bg: 'var(--background-color-error-subtle)', fg: 'var(--text-color-error)', bd: 'var(--border-color-error-subtle)' },
  warning:   { bg: 'var(--background-color-warning-subtle)', fg: 'var(--text-color-warning)', bd: 'var(--border-color-warning-subtle)' },
};

/**
 * Badge — a NON-INTERACTIVE information carrier. Never clickable; it only
 * communicates state. Three forms:
 *   • status label  <Badge tone="success">Verified</Badge>  (children present)
 *   • count         <Badge count={3} />                     (numeric)
 *   • dot           <Badge dot tone="error" />              (bare indicator)
 * For anything the user can act on (filter, select, remove) use `Tag` instead.
 */
export function Badge({ count, dot = false, children, tone, outlined = false, uppercase = false, prefixIcon, max = 99, style, ...rest }) {
  // Dot indicator
  if (dot) {
    const [bg] = SOLID[tone] || SOLID.primary;
    return <span aria-hidden="true" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 'var(--radius-full)', background: bg, ...style }} {...rest} />;
  }

  // Count indicator (circular)
  if (children == null && count != null) {
    const [bg, fg] = SOLID[tone] || SOLID.primary;
    const label = typeof count === 'number' && count > max ? `${max}+` : count;
    return (
      <span className="txt-label-m-semibold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 20, height: 20, padding: '0 6px', borderRadius: 'var(--radius-full)', background: bg, color: fg, fontVariantNumeric: 'tabular-nums', ...style }} {...rest}>
        {label}
      </span>
    );
  }

  // Status / information label (soft-rounded rectangle)
  const t = SUBTLE[tone] || SUBTLE.neutral;
  return (
    <span
      className="txt-label-m-semibold"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 'var(--radius-xs)',
        background: outlined ? 'transparent' : t.bg,
        color: t.fg,
        border: outlined ? `1px solid ${t.bd}` : '1px solid transparent',
        whiteSpace: 'nowrap', textTransform: uppercase ? 'uppercase' : undefined,
        ...style,
      }}
      {...rest}
    >
      {prefixIcon}
      {children}
    </span>
  );
}
