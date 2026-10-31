import React from 'react';

const HEIGHTS = { s: 32, m: 40, l: 48 };

const STATE_BORDER = {
  none:    'var(--border-color-main)',
  valid:   'var(--border-color-success)',
  invalid: 'var(--border-color-error)',
};

/**
 * Single-line text field with label, optional prepend/append nodes, helper
 * text and validation state. rounded-sm (4px) container, 16px input text.
 */
export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  helper,
  state = 'none',
  size = 'm',
  disabled = false,
  prepend,
  append,
  id,
  style,
  ...rest
}) {
  const autoId = React.useId();
  const inputId = id || autoId;
  const border = disabled ? 'var(--border-color-disabled)' : STATE_BORDER[state] || STATE_BORDER.none;
  const msgColor = state === 'invalid' ? 'var(--text-color-error)' : state === 'valid' ? 'var(--text-color-success)' : 'var(--text-color-subtlest)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', ...style }}>
      {label && (
        <label htmlFor={inputId} className="txt-label-m-semibold text-main">{label}</label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          minHeight: HEIGHTS[size],
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${border}`,
          background: disabled ? 'var(--background-color-disabled)' : 'var(--background-color-surface)',
          transition: 'var(--transition-border)',
          paddingLeft: prepend ? 14 : 0,
          paddingRight: append ? 14 : 0,
        }}
      >
        {prepend && <span style={{ display: 'flex', color: 'var(--text-color-icon-subtle)', marginRight: 8 }}>{prepend}</span>}
        <input
          id={inputId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="txt-body-m-regular"
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: 0,
            background: 'transparent',
            padding: '10px 12px',
            color: disabled ? 'var(--text-color-disabled)' : 'var(--text-color-main)',
            fontSize: 16,
          }}
          {...rest}
        />
        {append && <span style={{ display: 'flex', color: 'var(--text-color-icon-subtle)', marginLeft: 8 }}>{append}</span>}
      </div>
      {helper && <span className="txt-label-s-regular" style={{ color: msgColor, marginTop: 4 }}>{helper}</span>}
    </div>
  );
}
