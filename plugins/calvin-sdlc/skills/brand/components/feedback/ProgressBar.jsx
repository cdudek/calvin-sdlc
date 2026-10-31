import React from 'react';

/** Linear progress bar (0–100). Brand-purple fill on a neutral track. */
export function ProgressBar({ value = 0, max = 100, label, showValue = false, style }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ width: '100%', ...style }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          {label && <span className="txt-label-m-medium text-subtle">{label}</span>}
          {showValue && <span className="txt-label-m-medium text-subtle" style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--background-color-surface-elevation-3)', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 'var(--radius-full)', background: 'var(--background-color-primary-main)', transition: 'width 200ms ease-out' }} />
      </div>
    </div>
  );
}

/** Circular loading spinner. `size` px, inherits currentColor unless `color`. */
export function Spinner({ size = 24, strokeWidth = 3, color = 'var(--background-color-primary-main)', style }) {
  return (
    <span role="status" aria-label="Loading" style={{ display: 'inline-flex', width: size, height: size, ...style }}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'omr-spin 800ms linear infinite' }}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="var(--border-color-subtle)" strokeWidth={strokeWidth} />
        <path d="M12 3 a9 9 0 0 1 9 9" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes omr-spin{to{transform:rotate(360deg)}}' }} />
    </span>
  );
}
