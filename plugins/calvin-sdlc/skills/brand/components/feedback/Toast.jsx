import React from 'react';

const TONES = {
  neutral: { icon: 'var(--text-color-icon-inverse)', glyph: null },
  success: { icon: 'var(--graphic-color-success)', glyph: 'check' },
  error:   { icon: 'var(--border-color-error)', glyph: 'alert' },
  info:    { icon: 'var(--text-color-primary-subtle)', glyph: 'info' },
};

/**
 * Toast — brief, non-blocking notification. Dark inverse surface, optional
 * status icon and action. Position it fixed in your layout (bottom-centre by
 * default here). For decisions that block, use Modal instead.
 */
export function Toast({ tone = 'neutral', message, action, onClose, style }) {
  const t = TONES[tone] || TONES.neutral;
  const glyphs = {
    check: <polyline points="20 6 9 17 4 12" />,
    alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
    info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  };
  return (
    <div role="status" style={{
      display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 14px 12px 16px', borderRadius: 'var(--radius-lg)',
      background: 'var(--background-color-surface-inverse)', color: 'var(--text-color-inverse)',
      maxWidth: 420, ...style,
    }}>
      {t.glyph && (
        <span style={{ display: 'flex', color: t.icon, flex: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{glyphs[t.glyph]}</svg>
        </span>
      )}
      <span className="txt-body-s-medium" style={{ flex: 1, color: 'var(--text-color-inverse)' }}>{message}</span>
      {action}
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss" className="state-layer-neutral-inverse omr-focus-visible-outline"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, border: 0, borderRadius: 'var(--radius-lg)', background: 'transparent', color: 'var(--text-color-inverse)', cursor: 'pointer', flex: 'none', opacity: 0.8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      )}
    </div>
  );
}
