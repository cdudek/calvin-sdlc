import React from 'react';

const HEIGHTS = { s: 32, m: 40, l: 48 };
const STATE_BORDER = {
  none: 'var(--border-color-main)',
  valid: 'var(--border-color-success)',
  invalid: 'var(--border-color-error)',
};

// Lucide glyph via the global Icon component (registered on window namespace).
function Glyph({ name, size = 16, color }) {
  const NS = typeof window !== 'undefined' ? (window.OMRDesignSystem_d9b3c2 || {}) : {};
  const I = NS.Icon;
  return I ? <I name={name} size={size} color={color} /> : null;
}

/**
 * RichSelectField — fully custom select with keyboard navigation, optional
 * search, single/multi-select, clearable state and validation icons.
 * Trigger is styled identically to a form field (rounded-sm, state border);
 * the dropdown is a bordered, shadowed surface panel.
 * Port of the OMR `RichSelectField` Vue component.
 */
export function RichSelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  multiple = false,
  clearable = false,
  searchable = false,
  disabled = false,
  placeholder = 'Select…',
  size = 'm',
  state = 'none',
  counter = false,
  helper,
  maxHeight = 320,
  prepend,
  style,
}) {
  const autoId = React.useId();
  const fieldId = id || autoId;
  const rootRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [hi, setHi] = React.useState(-1);

  const values = multiple ? (Array.isArray(value) ? value : []) : (value == null ? [] : [value]);
  const hasValue = values.length > 0;
  const selectedEntries = options.filter((o) => values.includes(o.value));
  const displayText = selectedEntries.map((e) => e.label).join(', ');

  const visible = React.useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) close(); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  function openPanel() { if (disabled) return; setOpen(true); setQuery(''); setHi(-1); }
  function close() { setOpen(false); setQuery(''); setHi(-1); }
  function toggle() { open ? close() : openPanel(); }

  function isSelected(v) { return values.includes(v); }

  function select(opt) {
    if (opt.disabled) return;
    if (multiple) {
      const next = values.includes(opt.value) ? values.filter((v) => v !== opt.value) : [...values, opt.value];
      onChange && onChange(next);
    } else {
      onChange && onChange(opt.value);
      close();
    }
  }

  function onClear(e) {
    e.stopPropagation();
    onChange && onChange(multiple ? [] : undefined);
  }

  function onKeyDown(e) {
    if (disabled) return;
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!open) { e.preventDefault(); openPanel(); }
        else if (hi >= 0 && visible[hi]) { e.preventDefault(); select(visible[hi]); }
        break;
      case 'Escape': if (open) { e.preventDefault(); close(); } break;
      case 'ArrowDown': e.preventDefault(); if (!open) openPanel(); else setHi((i) => Math.min(i + 1, visible.length - 1)); break;
      case 'ArrowUp': e.preventDefault(); if (open) setHi((i) => Math.max(i - 1, 0)); break;
      case 'Tab': if (open) close(); break;
      default: break;
    }
  }

  const border = disabled ? 'var(--border-color-disabled)' : STATE_BORDER[state] || STATE_BORDER.none;
  const showClear = clearable && hasValue && !disabled;
  const msgColor = state === 'invalid' ? 'var(--text-color-error)' : state === 'valid' ? 'var(--text-color-success)' : 'var(--text-color-subtlest)';

  function optStyle(opt, idx) {
    const sel = isSelected(opt.value);
    const highlighted = idx === hi;
    let bg = 'transparent', color = 'var(--text-color-subtle)';
    if (opt.disabled) { color = 'var(--text-color-disabled)'; }
    else if (highlighted && sel) { bg = 'var(--background-color-state-hover-primary)'; color = 'var(--text-color-selected)'; }
    else if (highlighted) { bg = 'var(--background-color-state-hover-neutral)'; color = 'var(--text-color-main)'; }
    else if (sel) { bg = 'var(--background-color-surface-elevation-1)'; color = 'var(--text-color-selected)'; }
    return { bg, color, cursor: opt.disabled ? 'not-allowed' : 'pointer' };
  }

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', position: 'relative', ...style }}>
      {label && <label htmlFor={fieldId} className="txt-label-m-semibold text-main">{label}</label>}

      <button
        type="button"
        id={fieldId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className="omr-focus-visible-outline"
        style={{
          display: 'flex', alignItems: 'center', gap: 2, width: '100%',
          height: HEIGHTS[size], padding: 0, textAlign: 'left',
          borderRadius: 'var(--radius-sm)', border: `1px solid ${border}`,
          background: disabled ? 'var(--background-color-disabled)' : 'var(--background-color-surface)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'var(--transition-border)', appearance: 'none',
        }}
      >
        {prepend && <span style={{ display: 'flex', alignItems: 'center', paddingLeft: 12, color: 'var(--text-color-icon-subtle)' }}>{prepend}</span>}
        <span className="txt-body-m-regular" style={{ display: 'flex', flex: 1, minWidth: 0, alignItems: 'center', gap: 6, padding: '0 8px' }}>
          {hasValue ? (
            <>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-color-main)' }}>{displayText}</span>
              {counter && multiple && values.length > 0 && (
                <span className="txt-label-s-bold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 'var(--radius-full)', background: 'var(--background-color-primary-main)', color: 'var(--text-color-inverse)', flex: 'none' }}>{values.length}</span>
              )}
            </>
          ) : (
            <span className="text-subtlest" style={{ color: 'var(--text-color-subtlest)' }}>{placeholder}</span>
          )}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, paddingRight: 8, flexShrink: 0, color: 'var(--text-color-icon-subtle)' }}>
          {showClear && (
            <span role="button" tabIndex={-1} onClick={onClear} className="state-layer-neutral" style={{ display: 'flex', padding: 2, borderRadius: 4, cursor: 'pointer' }} aria-label="Clear"><Glyph name="x" size={16} /></span>
          )}
          {state === 'invalid' && <span style={{ display: 'flex', color: 'var(--text-color-icon-error)' }}><Glyph name="octagon-alert" size={16} /></span>}
          {state === 'valid' && <span style={{ display: 'flex', color: 'var(--text-color-icon-success)' }}><Glyph name="circle-check" size={16} /></span>}
          <span style={{ display: 'flex', transition: 'var(--transition-transform)', transform: open ? 'rotate(180deg)' : 'none' }}><Glyph name="chevron-down" size={16} /></span>
        </span>
      </button>

      {open && !disabled && (
        <div
          role="listbox"
          aria-multiselectable={multiple || undefined}
          style={{
            position: 'absolute', top: `calc(${label ? '22px + ' : ''}${HEIGHTS[size]}px + 10px)`, left: 0, right: 0, zIndex: 50,
            marginTop: 0, maxHeight, overflow: 'auto',
            borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color-subtle)',
            background: 'var(--background-color-surface)',
            boxShadow: '0 8px 24px -8px rgba(12,13,15,0.20)',
          }}
        >
          {searchable && (
            <div style={{ padding: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', height: HEIGHTS.s, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color-main)', background: 'var(--background-color-surface)' }}>
                <input
                  autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setHi(-1); }}
                  onClick={(e) => e.stopPropagation()} placeholder={placeholder}
                  className="txt-body-m-regular"
                  style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', padding: '0 10px', color: 'var(--text-color-main)', fontSize: 16 }}
                />
                <span style={{ display: 'flex', paddingRight: 10, color: 'var(--text-color-icon-subtle)' }}><Glyph name="search" size={16} /></span>
              </div>
            </div>
          )}
          {visible.length === 0 ? (
            <div className="txt-body-m-regular text-subtlest" style={{ padding: '8px 12px' }}>No options</div>
          ) : visible.map((opt, idx) => {
            const os = optStyle(opt, idx);
            return (
              <div
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected(opt.value)}
                aria-disabled={opt.disabled || undefined}
                onMouseEnter={() => !opt.disabled && setHi(idx)}
                onClick={(e) => { e.stopPropagation(); select(opt); }}
                className="txt-body-m-regular"
                style={{ padding: '8px 12px', background: os.bg, color: os.color, cursor: os.cursor, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>{opt.label}</div>
                {multiple && isSelected(opt.value) && <span style={{ display: 'flex', color: 'var(--text-color-icon-selected)' }}><Glyph name="check" size={16} /></span>}
              </div>
            );
          })}
        </div>
      )}

      {helper && <span className="txt-label-s-regular" style={{ color: msgColor, marginTop: 4 }}>{helper}</span>}
    </div>
  );
}
