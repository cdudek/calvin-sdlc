import React from 'react';

/** Single radio button with optional label + description. */
export function Radio({ checked = false, onChange, name, value, label, description, disabled = false, id, style, ...rest }) {
  const autoId = React.useId();
  const rid = id || autoId;
  const borderCol = checked ? 'var(--border-color-selected)' : 'var(--border-color-strong)';
  return (
    <label htmlFor={rid} style={{ display: 'flex', gap: 10, alignItems: description ? 'flex-start' : 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, ...style }}>
      <span style={{ position: 'relative', width: 20, height: 20, flex: 'none', marginTop: description ? 2 : 0 }}>
        <input
          id={rid} type="radio" name={name} value={value} checked={checked} disabled={disabled}
          onChange={(e) => onChange && onChange(e)}
          className="omr-focus-visible-outline"
          style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', margin: 0, cursor: 'inherit' }}
          {...rest}
        />
        <span aria-hidden="true" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 'var(--radius-full)',
          border: `1.5px solid ${borderCol}`, background: 'var(--background-color-surface)', transition: 'var(--transition-border)',
        }}>
          {checked && <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: 'var(--background-color-primary-main)' }} />}
        </span>
      </span>
      {(label || description) && (
        <span>
          {label && <span className="txt-body-m-regular text-main" style={{ display: 'block' }}>{label}</span>}
          {description && <span className="txt-body-s-regular text-subtlest" style={{ display: 'block', marginTop: 2 }}>{description}</span>}
        </span>
      )}
    </label>
  );
}

/** Radio presented as a selectable card — brand border + tint when selected. */
export function RadioCard({ checked = false, onChange, name, value, title, description, disabled = false, style }) {
  return (
    <label style={{
      display: 'flex', gap: 12, alignItems: 'flex-start', padding: 16, borderRadius: 'var(--radius-card)',
      border: `1px solid ${checked ? 'var(--border-color-selected)' : 'var(--border-color-main)'}`,
      background: checked ? 'var(--background-color-primary-subtle)' : 'var(--background-color-surface-elevation-1)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, transition: 'var(--transition-background), var(--transition-border)', ...style,
    }}>
      <Radio checked={checked} onChange={onChange} name={name} value={value} disabled={disabled} />
      <span>
        <span className={`txt-body-m-bold ${checked ? 'text-selected' : 'text-main'}`} style={{ display: 'block' }}>{title}</span>
        {description && <span className="txt-body-s-regular text-subtle" style={{ display: 'block', marginTop: 2 }}>{description}</span>}
      </span>
    </label>
  );
}
