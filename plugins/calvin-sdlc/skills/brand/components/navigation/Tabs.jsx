import React from 'react';

const SIZES = { small: { py: 8, txt: 'txt-body-s-bold' }, medium: { py: 12, txt: 'txt-body-m-bold' }, large: { py: 16, txt: 'txt-body-l-bold' } };

/**
 * Tabs — underline tab bar. `items` is a list of { id, label, icon?, badge? }.
 * Selected tab shows the brand underline (or neutral ink when color=false).
 */
export function Tabs({ items = [], value, onChange, size = 'medium', color = true, style }) {
  const s = SIZES[size] || SIZES.medium;
  const active = value != null ? value : (items[0] && items[0].id);
  const sel = color ? 'var(--text-color-primary)' : 'var(--text-color-main)';
  const bd = color ? 'var(--border-color-selected)' : 'var(--text-color-main)';
  return (
    <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-color-subtle)', overflowX: 'auto', ...style }}>
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button key={it.id} role="tab" aria-selected={on} onClick={() => onChange && onChange(it.id)}
            className={`${s.txt} state-layer-neutral omr-focus-visible-outline`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: `${s.py}px 16px`, border: 0, background: 'transparent',
              color: on ? sel : 'var(--text-color-subtle)', cursor: 'pointer', whiteSpace: 'nowrap',
              borderBottom: `2px solid ${on ? bd : 'transparent'}`, marginBottom: -1, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            }}>
            {it.icon}
            {it.label}
            {it.badge != null && (
              <span className="txt-label-s-bold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 'var(--radius-full)', background: on ? 'var(--background-color-primary-subtle)' : 'var(--background-color-surface-elevation-3)', color: on ? 'var(--text-color-selected)' : 'var(--text-color-subtle)' }}>{it.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
