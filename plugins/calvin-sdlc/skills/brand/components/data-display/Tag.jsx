import React from 'react';

/**
 * Tag — an INTERACTIVE label. Use for anything the user can act on: filters,
 * selectable facets, removable selections. Clickable (`onClick`) and/or
 * removable (`onRemove`), with hover + selected states. For a static,
 * non-interactive information carrier (e.g. a status) use `Badge` instead.
 */
export function Tag({ children, onClick, onRemove, selected = false, prefixIcon, style, ...rest }) {
  const interactive = !!onClick;
  return (
    <span
      className={`txt-label-m-semibold${interactive ? ' state-layer-neutral omr-focus-visible-outline' : ''}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: onRemove ? '3px 4px 3px 8px' : '3px 8px',
        borderRadius: 'var(--radius-full)',
        background: selected ? 'var(--background-color-primary-subtle)' : 'var(--background-color-surface-elevation-3)',
        color: selected ? 'var(--text-color-selected)' : 'var(--text-color-main)',
        border: `1px solid ${selected ? 'var(--border-color-selected)' : 'transparent'}`,
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
      {...rest}
    >
      {prefixIcon}
      {children}
      {onRemove && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(e); }} aria-label="Remove" className="state-layer-neutral omr-focus-visible-outline"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, border: 0, borderRadius: 'var(--radius-full)', background: 'transparent', color: 'inherit', cursor: 'pointer', flex: 'none' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      )}
    </span>
  );
}
