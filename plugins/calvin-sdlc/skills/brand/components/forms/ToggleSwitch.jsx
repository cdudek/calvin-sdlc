import React from 'react';

const SIZES = { s: { w: 36, h: 20, k: 14 }, m: { w: 44, h: 24, k: 18 } };
const ON = {
  primary: 'var(--background-color-primary-main)',
  success: 'var(--graphic-color-success)',
  error: 'var(--border-color-error)',
};

/** On/off toggle switch. Track fills with the colour when active. */
export function ToggleSwitch({ checked = false, onChange, size = 'm', color = 'primary', label, disabled = false, id, style, ...rest }) {
  const autoId = React.useId();
  const tid = id || autoId;
  const s = SIZES[size] || SIZES.m;
  const pad = (s.h - s.k) / 2;
  const track = (
    <span style={{ position: 'relative', width: s.w, height: s.h, flex: 'none' }}>
      <input
        id={tid} type="checkbox" role="switch" checked={checked} disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked, e)}
        className="omr-focus-visible-outline"
        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', margin: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}
        {...rest}
      />
      <span aria-hidden="true" style={{
        display: 'block', width: s.w, height: s.h, borderRadius: 'var(--radius-full)',
        background: checked ? ON[color] : 'var(--background-color-toggle-inactive, rgba(20,27,40,0.5))',
        transition: 'var(--transition-background)',
      }}>
        <span style={{
          position: 'absolute', top: pad, left: checked ? s.w - s.k - pad : pad, width: s.k, height: s.k,
          borderRadius: 'var(--radius-full)', background: 'var(--background-color-solid)', boxShadow: '0 1px 3px rgba(12,13,15,0.3)',
          transition: 'left 150ms ease-in-out',
        }} />
      </span>
    </span>
  );
  if (!label) return <label htmlFor={tid} style={{ display: 'inline-flex', opacity: disabled ? 0.4 : 1, ...style }}>{track}</label>;
  return (
    <label htmlFor={tid} style={{ display: 'inline-flex', gap: 10, alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, ...style }}>
      {track}
      <span className="txt-body-m-regular text-main">{label}</span>
    </label>
  );
}
