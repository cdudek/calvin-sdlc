import React from 'react';

const SIZES = {
  xs: { height: 32, minWidth: 100, padding: '0 10px', gap: 8, radius: 'var(--radius-button-compact)', txt: 'txt-body-s-semibold' },
  s:  { height: 40, minWidth: 100, padding: '0 14px', gap: 8, radius: 'var(--radius-button-compact)', txt: 'txt-body-m-semibold' },
  m:  { height: 48, minWidth: 160, padding: '0 18px', gap: 12, radius: 'var(--radius-button)', txt: 'txt-body-m-semibold' },
  l:  { height: 64, minWidth: 160, padding: '0 24px', gap: 20, radius: 'var(--radius-button)', txt: 'txt-body-l-semibold' },
};

// Shared per-intent text colour (secondary + outline use these).
const INTENT_TEXT = {
  color: '--text-color-primary',
  neutral: '--text-color-main',
  success: '--text-color-success',
  destructive: '--text-color-error',
};
// Per-intent border (secondary + outline). Neutral uses border-strong.
const INTENT_BORDER = {
  color: '--border-color-primary',
  neutral: '--border-color-strong',
  success: '--border-color-success',
  destructive: '--border-color-error',
};

// [background var, text color var] per variant+intent.
const FILLS = {
  primary: {
    color:       ['--background-color-button-primary-color', '--text-color-inverse'],
    neutral:     ['--background-color-button-primary-neutral', '--text-color-inverse'],
    success:     ['--background-color-button-primary-success', '--text-color-inverse'],
    destructive: ['--background-color-button-primary-destructive', '--text-color-inverse'],
  },
  secondary: {
    color:       ['--background-color-button-secondary-color', '--text-color-primary'],
    neutral:     ['--background-color-button-secondary-neutral', '--text-color-main'],
    success:     ['--background-color-button-secondary-success', '--text-color-success'],
    destructive: ['--background-color-button-secondary-destructive', '--text-color-error'],
  },
};

// Outline background tokens (transparent tints; neutral has no -intent token).
const OUTLINE_BG = {
  color: '--background-color-button-outline-color',
  neutral: '--background-color-button-outline',
  success: '--background-color-button-outline-success',
  destructive: '--background-color-button-outline-destructive',
};

export function Button({
  variant = 'primary',
  intent = 'color',
  size = 'm',
  disabled = false,
  fullWidth = false,
  prefixIcon,
  suffixIcon,
  onClick,
  children,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.m;

  let bg, color, border;
  if (variant === 'outline') {
    bg = `var(${OUTLINE_BG[intent]})`;
    color = `var(${INTENT_TEXT[intent]})`;
    border = `1px solid var(${INTENT_BORDER[intent]})`;
  } else if (variant === 'secondary') {
    const [bgVar, textVar] = FILLS.secondary[intent];
    bg = `var(${bgVar})`;
    color = `var(${textVar})`;
    border = `1px solid var(${INTENT_BORDER[intent]})`;
  } else {
    const [bgVar, textVar] = FILLS.primary[intent];
    bg = `var(${bgVar})`;
    color = `var(${textVar})`;
    border = '1px solid transparent';
  }

  // State layer: primary -> neutral-inverse; secondary/outline -> primary for
  // the brand (color) intent, neutral otherwise.
  const stateClass = variant === 'primary'
    ? 'state-layer-neutral-inverse'
    : (intent === 'color' ? 'state-layer-primary' : 'state-layer-neutral');

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${s.txt} ${disabled ? '' : stateClass} omr-focus-visible-outline`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        minWidth: fullWidth ? '100%' : s.minWidth,
        width: fullWidth ? '100%' : undefined,
        padding: s.padding,
        borderRadius: s.radius,
        border,
        background: bg,
        color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'var(--transition-background), var(--transition-border)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {prefixIcon}
      {children != null && <span style={{ whiteSpace: 'nowrap' }}>{children}</span>}
      {suffixIcon}
    </button>
  );
}
