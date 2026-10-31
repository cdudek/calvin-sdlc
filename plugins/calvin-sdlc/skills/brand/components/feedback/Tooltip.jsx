import React from 'react';

const POS = {
  top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', mb: 8 },
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', mt: 8 },
  left:   { right: '100%', top: '50%', transform: 'translateY(-50%)', mr: 8 },
  right:  { left: '100%', top: '50%', transform: 'translateY(-50%)', ml: 8 },
};

/**
 * Tooltip — small inverse label shown on hover/focus of its child. Wrap the
 * trigger element as the child; `label` is the tooltip text. Hover-driven.
 */
export function Tooltip({ label, position = 'top', children, style }) {
  const [show, setShow] = React.useState(false);
  const p = POS[position] || POS.top;
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {children}
      {show && (
        <span role="tooltip" style={{
          position: 'absolute', ...(p.mb && { marginBottom: p.mb }), ...(p.mt && { marginTop: p.mt }),
          ...(p.mr && { marginRight: p.mr }), ...(p.ml && { marginLeft: p.ml }),
          bottom: p.bottom, top: p.top, left: p.left, right: p.right, transform: p.transform,
          zIndex: 40, whiteSpace: 'nowrap', padding: '6px 10px', borderRadius: 'var(--radius-lg)',
          background: 'var(--background-color-surface-inverse)', color: 'var(--text-color-inverse)',
          boxShadow: '0 6px 20px -6px rgba(12,13,15,0.4)', pointerEvents: 'none', ...style,
        }} className="txt-label-s-medium">{label}</span>
      )}
    </span>
  );
}
