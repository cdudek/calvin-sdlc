import React from 'react';

const TXT = { l: 'txt-body-l-bold', m: 'txt-body-m-bold', s: 'txt-body-s-bold' };

/**
 * Standalone link styled as a text button. No underline by default; underline
 * appears on hover (or force it with `underline`). For a link embedded in prose,
 * use InlineLink instead.
 */
export function BtnLink({
  href,
  variant = 'color',
  size = 'm',
  underline = false,
  prefixIcon,
  suffixIcon,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const color = variant === 'color' ? 'var(--text-color-link-primary)' : 'var(--text-color-link-main)';
  const stateClass = variant === 'color' ? 'state-layer-primary' : 'state-layer-neutral';

  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={`omr-btnlink ${TXT[size]} ${disabled ? '' : stateClass} omr-focus-visible-outline`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        lineHeight: 1,
        borderRadius: 'var(--radius-sm)',
        color: disabled ? 'var(--text-color-link-disabled)' : color,
        textDecoration: underline ? 'underline' : 'none',
        textDecorationThickness: '0.08em',
        textUnderlineOffset: '0.15em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: 'fit-content',
        ...style,
      }}
      {...rest}
    >
      {prefixIcon}
      <span>{children}</span>
      {suffixIcon}
    </a>
  );
}

/** Inline hyperlink for running prose — always underlined, brand or neutral. */
export function InlineLink({ href, variant = 'color', children, style, ...rest }) {
  const color = variant === 'color' ? 'var(--text-color-link-primary)' : 'inherit';
  return (
    <a
      href={href}
      style={{
        color,
        textDecoration: 'underline',
        textDecorationThickness: '0.08em',
        textUnderlineOffset: '0.15em',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
