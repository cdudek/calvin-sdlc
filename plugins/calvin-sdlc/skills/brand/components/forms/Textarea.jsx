import React from 'react';

/** Multi-line text field. Same chrome as TextInput; auto-min-height via rows. */
export function Textarea({ label, value, onChange, placeholder, helper, state = 'none', rows = 4, disabled = false, id, style, ...rest }) {
  const autoId = React.useId();
  const tid = id || autoId;
  const border = disabled ? 'var(--border-color-disabled)' : state === 'invalid' ? 'var(--border-color-error)' : state === 'valid' ? 'var(--border-color-success)' : 'var(--border-color-main)';
  const msgColor = state === 'invalid' ? 'var(--text-color-error)' : state === 'valid' ? 'var(--text-color-success)' : 'var(--text-color-subtlest)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', ...style }}>
      {label && <label htmlFor={tid} className="txt-label-m-semibold text-main">{label}</label>}
      <textarea
        id={tid} value={value} onChange={onChange} placeholder={placeholder} rows={rows} disabled={disabled}
        className="txt-body-m-regular omr-focus-visible-outline"
        style={{
          width: '100%', resize: 'vertical', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
          border: `1px solid ${border}`, background: disabled ? 'var(--background-color-disabled)' : 'var(--background-color-surface)',
          color: disabled ? 'var(--text-color-disabled)' : 'var(--text-color-main)', fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.4,
          transition: 'var(--transition-border)',
        }}
        {...rest}
      />
      {helper && <span className="txt-label-s-regular" style={{ color: msgColor, marginTop: 4 }}>{helper}</span>}
    </div>
  );
}
