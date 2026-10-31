import React from 'react';

const TONES = {
  neutral:     { bg: 'var(--background-color-surface-elevation-3)', fg: 'var(--text-color-main)', bd: 'var(--border-color-main)' },
  primary:     { bg: 'var(--background-color-primary-subtle)', fg: 'var(--text-color-selected)', bd: 'var(--border-color-selected)' },
  secondary:   { bg: 'var(--background-color-secondary-subtle)', fg: 'var(--text-color-warning)', bd: 'var(--border-color-secondary)' },
  success:     { bg: 'var(--background-color-success-subtle)', fg: 'var(--text-color-success)', bd: 'var(--border-color-success-subtle)' },
  error:       { bg: 'var(--background-color-error-subtle)', fg: 'var(--text-color-error)', bd: 'var(--border-color-error-subtle)' },
  warning:     { bg: 'var(--background-color-warning-subtle)', fg: 'var(--text-color-warning)', bd: 'var(--border-color-warning-subtle)' },
};

/**
 * Compact label for categories, tags, statuses. Colour carries meaning.
 * rounded-xs rectangle like core-ui ChipBadge, NOT a pill. Filled or outlined.
 */
export function Chip({ tone = 'neutral', outlined = false, uppercase = false, prefixIcon, children, style, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      className="txt-label-m-semibold"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 'var(--radius-xs)',
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
