import React from 'react';

// Faithful recreation of OMR core-ui MessageBanner.vue.
// type → { border, background, color, iconColor, glyph }
const TYPES = {
  info: {
    bg: 'var(--background-color-primary-subtler)', bd: 'var(--border-color-primary-subtle)',
    fg: 'var(--text-color-primary)', icon: 'var(--text-color-icon-primary)', glyph: 'info',
  },
  success: {
    bg: 'var(--background-color-success-subtle)', bd: 'var(--border-color-success-subtle)',
    fg: 'var(--text-color-success)', icon: 'var(--text-color-icon-success)', glyph: 'circle-check',
  },
  warning: {
    bg: 'var(--background-color-warning-subtle)', bd: 'var(--border-color-warning-subtle)',
    fg: 'var(--text-color-warning)', icon: 'var(--text-color-icon-warning)', glyph: 'triangle-alert',
  },
  error: {
    bg: 'var(--background-color-error-subtle)', bd: 'var(--border-color-error-subtle)',
    fg: 'var(--text-color-error)', icon: 'var(--text-color-icon-error)', glyph: 'octagon-alert',
  },
  neutral: {
    bg: 'var(--background-color-surface-elevation-2)', bd: 'var(--border-color-main)',
    fg: 'var(--text-color-subtle)', icon: 'var(--text-color-subtle)', glyph: 'info',
  },
  reminder: {
    bg: 'var(--background-color-success-subtle)', bd: 'var(--border-color-success-subtle)',
    fg: 'var(--text-color-success)', icon: 'var(--text-color-icon-success)', glyph: 'clock',
  },
};

const GLYPHS = {
  info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  'circle-check': <><circle cx="12" cy="12" r="10" /><polyline points="16 10 11 15 8 12" /></>,
  'triangle-alert': <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  'octagon-alert': <><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
};

/**
 * MessageBanner — status message surface. Icon + optional headline + message
 * (or slotted body) + optional action, on a status-tinted background.
 * Faithful to OMR core-ui MessageBanner: rounded-lg, p-6 (p-2 condensed),
 * headline text-headline-s, message text-body-m, lucide-icon-m glyph.
 */
export function Alert({
  type = 'info',
  headline,
  title,          // alias for headline
  message,
  children,
  action,
  filled = true,
  solid = false,  // solid = no border
  condensed = false,
  inline,         // 'top' | 'middle' | 'bottom' — flush edges
  style,
}) {
  const t = TYPES[type] || TYPES.info;
  const head = headline ?? title;
  const body = message ?? children;

  // radius + border rules mirror MessageBanner inlinePosition
  let borderRadius = 'var(--radius-lg)';
  let borderStyle = solid ? 'none' : `1px solid ${t.bd}`;
  let borderWidth;
  if (inline === 'top') { borderRadius = 0; borderWidth = solid ? '0' : '0 0 1px 0'; }
  else if (inline === 'middle') { borderRadius = 0; borderWidth = solid ? '0' : '1px 0'; }
  else if (inline === 'bottom') { borderRadius = 0; borderWidth = solid ? '0' : '1px 0 0 0'; }

  const containerBorder = inline
    ? { borderStyle: 'solid', borderColor: t.bd, borderWidth: borderWidth || 0 }
    : { border: borderStyle };

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        width: '100%',
        gap: 8,
        padding: condensed ? 8 : 24,
        borderRadius,
        background: filled ? t.bg : 'var(--background-color-surface)',
        color: t.fg,
        ...containerBorder,
        ...style,
      }}
    >
      <span style={{ display: 'flex', flex: 'none', color: t.icon, marginRight: 4 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{GLYPHS[t.glyph]}</svg>
      </span>
      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        {head && <h2 className="txt-headline-s-bold" style={{ margin: '0 0 4px', color: t.fg }}>{head}</h2>}
        {body && (
          <div
            className="txt-body-m-regular"
            style={{
              color: t.fg,
              ...(condensed ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : null),
            }}
          >
            {body}
          </div>
        )}
      </div>
      {action && <div style={{ flex: 'none', marginLeft: 8 }}>{action}</div>}
    </div>
  );
}
