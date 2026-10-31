import React from 'react';

/**
 * Blocking modal dialog. Backdrop with blur, centred surface, optional title
 * bar with close button and footer action row. Max 70% of the viewport.
 */
export function Modal({ isOpen = true, title, onClose, footer, children, width = 480, style }) {
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="blur-overlay-style"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width,
          maxWidth: '70%',
          maxHeight: '70%',
          background: 'var(--background-color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color-subtle)',
          boxShadow: '0 24px 64px -16px rgba(12,13,15,0.28)',
          overflow: 'hidden',
          ...style,
        }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '20px 24px', borderBottom: '1px solid var(--border-color-subtle)' }}>
            <h2 className="txt-headline-l-bold text-main" style={{ margin: 0 }}>{title}</h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="state-layer-neutral omr-focus-visible-outline"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, border: 0, borderRadius: 'var(--radius-lg)', background: 'transparent', color: 'var(--text-color-icon-subtle)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>{children}</div>
        {footer && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid var(--border-color-subtle)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
