import React from 'react';

/**
 * Checkbox with optional label. Supports checked / unchecked / indeterminate,
 * plus error styling. Selected state uses brand purple. rounded-sm box.
 */
export function Checkbox({ checked = false, indeterminate = false, onChange, label, description, error = false, disabled = false, id, style, ...rest }) {
  const autoId = React.useId();
  const cid = id || autoId;
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate && !checked; }, [indeterminate, checked]);
  const on = checked || indeterminate;
  const borderCol = error ? 'var(--border-color-error)' : on ? 'var(--border-color-selected)' : 'var(--border-color-strong)';

  return (
    <label htmlFor={cid} style={{ display: 'flex', gap: 10, alignItems: description ? 'flex-start' : 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, ...style }}>
      <span style={{ position: 'relative', width: 20, height: 20, flex: 'none', marginTop: description ? 2 : 0 }}>
        <input
          ref={ref} id={cid} type="checkbox" checked={checked} disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked, e)}
          className="omr-focus-visible-outline"
          style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', margin: 0, cursor: 'inherit' }}
          {...rest}
        />
        <span aria-hidden="true" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20,
          borderRadius: 'var(--radius-sm)', border: `1.5px solid ${borderCol}`,
          background: on ? 'var(--background-color-primary-main)' : 'var(--background-color-surface)',
          color: 'var(--text-color-solid-inverse)', transition: 'var(--transition-background), var(--transition-border)',
        }}>
          {indeterminate && !checked
            ? <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            : checked
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              : null}
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
