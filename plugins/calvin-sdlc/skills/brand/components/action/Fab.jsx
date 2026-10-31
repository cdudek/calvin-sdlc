import React from 'react';

const SIZES = { m: 48, l: 56 };

/**
 * Floating action button — circular, brand-filled, for a single primary
 * screen-level action. `icon` is required; `label` turns it into an extended
 * FAB (pill with text). Position it fixed in your layout.
 */
export function Fab({ icon, label, intent = 'color', size = 'l', onClick, style, ...rest }) {
  const px = SIZES[size] || SIZES.l;
  const bg = intent === 'neutral' ? 'var(--background-color-button-primary-neutral)' : 'var(--background-color-button-primary-color)';
  return (
    <button type="button" onClick={onClick}
      className="state-layer-neutral-inverse omr-focus-visible-outline"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        height: px, minWidth: px, padding: label ? '0 22px' : 0,
        borderRadius: 'var(--radius-full)', border: 0, background: bg, color: 'var(--text-color-inverse)',
        cursor: 'pointer', boxShadow: '0 8px 24px -6px rgba(12,13,15,0.35)',
        ...style,
      }}
      {...rest}
    >
      {icon}
      {label && <span className="txt-body-m-bold" style={{ color: 'var(--text-color-inverse)' }}>{label}</span>}
    </button>
  );
}
