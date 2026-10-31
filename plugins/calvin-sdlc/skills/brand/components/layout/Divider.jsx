import React from 'react';

/** Divider — thin rule. `orientation` horizontal (default) or vertical.
 *  Optional centred `label` for "or"-style separators (horizontal only). */
export function Divider({ orientation = 'horizontal', label, subtle = false, style }) {
  const color = subtle ? 'var(--border-color-subtle)' : 'var(--border-color-main)';
  if (orientation === 'vertical') {
    return <span style={{ display: 'inline-block', width: 1, alignSelf: 'stretch', background: color, ...style }} />;
  }
  if (label) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
        <span style={{ flex: 1, height: 1, background: color }} />
        <span className="txt-label-s-medium text-subtlest">{label}</span>
        <span style={{ flex: 1, height: 1, background: color }} />
      </div>
    );
  }
  return <hr style={{ border: 0, height: 1, background: color, margin: 0, ...style }} />;
}
