import React from 'react';

/**
 * Content container. Elevated surface, hairline border, rounded-sm like core-ui CardBox.
 * Don't nest cards in cards. `interactive` adds hover feedback + pointer.
 */
export function Card({
  interactive = false,
  selected = false,
  media,
  footer,
  padding = 24,
  children,
  onClick,
  style,
  ...rest
}) {
  return (
    <div
      onClick={onClick}
      className={interactive ? 'state-layer-neutral' : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--background-color-surface-elevation-1)',
        border: `1px solid ${selected ? 'var(--border-color-selected)' : 'var(--border-color-main)'}`,
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'var(--transition-border)',
        ...style,
      }}
      {...rest}
    >
      {media && <div style={{ margin: -1, marginBottom: 0 }}>{media}</div>}
      <div style={{ padding, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {children}
      </div>
      {footer && (
        <div style={{ padding, paddingTop: 0, display: 'flex', gap: 8, alignItems: 'center' }}>
          {footer}
        </div>
      )}
    </div>
  );
}
