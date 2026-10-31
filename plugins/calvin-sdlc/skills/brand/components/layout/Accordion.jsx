import React from 'react';

/**
 * Accordion — a list of expandable sections. `items` = [{ title, content }].
 * `divider` draws a line between rows. Single-open by default; set `multi`.
 */
export function Accordion({ items = [], multi = false, defaultOpen = [], divider = true, style }) {
  const [open, setOpen] = React.useState(new Set(defaultOpen));
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(multi ? prev : []);
    if (prev.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  return (
    <div style={{ borderTop: divider ? '1px solid var(--border-color-subtle)' : 'none', ...style }}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} style={{ borderBottom: divider ? '1px solid var(--border-color-subtle)' : 'none' }}>
            <button type="button" onClick={() => toggle(i)} aria-expanded={isOpen}
              className="state-layer-neutral omr-focus-visible-outline"
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '18px 4px', border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left', borderRadius: 'var(--radius-lg)' }}>
              <span className="txt-headline-m-bold text-main" style={{ flex: 1 }}>{it.title}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-color-icon-subtle)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease-out', flex: 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {isOpen && (
              <div className="txt-body-m-regular text-subtle" style={{ padding: '0 4px 20px' }}>{it.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
