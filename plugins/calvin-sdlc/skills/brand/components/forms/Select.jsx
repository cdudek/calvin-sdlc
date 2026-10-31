import React from 'react';

const HEIGHTS = { s: 32, m: 40, l: 48 };

/**
 * Select / dropdown field. Click to open a list of options; keyboard-free
 * lightweight implementation for prototypes. Matches TextInput chrome.
 */
export function Select({ label, value, onChange, options = [], placeholder = 'Select…', size = 'm', disabled = false, error = false, helper, id, style }) {
  const autoId = React.useId();
  const sid = id || autoId;
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const selected = opts.find((o) => o.value === value);
  const border = error ? 'var(--border-color-error)' : open ? 'var(--border-color-selected)' : 'var(--border-color-main)';

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', position: 'relative', ...style }}>
      {label && <label htmlFor={sid} className="txt-label-m-semibold text-main">{label}</label>}
      <button
        id={sid} type="button" disabled={disabled} onClick={() => setOpen((o) => !o)}
        className="omr-focus-visible-outline"
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: HEIGHTS[size], padding: '0 12px',
          borderRadius: 'var(--radius-sm)', border: `1px solid ${border}`,
          background: disabled ? 'var(--background-color-disabled)' : 'var(--background-color-surface)',
          color: selected ? 'var(--text-color-main)' : 'var(--text-color-subtlest)',
          cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'var(--transition-border)',
        }}
      >
        <span className="txt-body-m-regular" style={{ flex: 1 }}>{selected ? selected.label : placeholder}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-color-icon-subtle)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease-out' }}><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 10, padding: 4,
          background: 'var(--background-color-surface)', border: '1px solid var(--border-color-main)',
          borderRadius: 'var(--radius-xl)', boxShadow: '0 12px 32px -8px rgba(12,13,15,0.22)', maxHeight: 240, overflowY: 'auto',
        }}>
          {opts.map((o) => {
            const isSel = o.value === value;
            return (
              <div key={o.value} onClick={() => { onChange && onChange(o.value); setOpen(false); }}
                className="state-layer-neutral"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  background: isSel ? 'var(--background-color-primary-subtle)' : 'transparent' }}>
                <span className={`txt-body-m-regular ${isSel ? 'text-selected' : 'text-main'}`} style={{ flex: 1 }}>{o.label}</span>
                {isSel && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-color-selected)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
            );
          })}
        </div>
      )}
      {helper && <span className="txt-label-s-regular" style={{ color: error ? 'var(--text-color-error)' : 'var(--text-color-subtlest)', marginTop: 4 }}>{helper}</span>}
    </div>
  );
}
