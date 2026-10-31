import React from 'react';

/** Range slider. Filled portion + value bubble use brand purple. */
export function RangeSlider({ value = 50, min = 0, max = 100, step = 1, onChange, label, showValue = true, disabled = false, id, style }) {
  const autoId = React.useId();
  const rid = id || autoId;
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', opacity: disabled ? 0.4 : 1, ...style }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {label && <label htmlFor={rid} className="txt-label-m-medium text-subtle">{label}</label>}
          {showValue && <span className="txt-body-s-bold text-main" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>}
        </div>
      )}
      <input
        id={rid} type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange && onChange(Number(e.target.value), e)}
        style={{
          WebkitAppearance: 'none', appearance: 'none', width: '100%', height: 6, borderRadius: 999, cursor: disabled ? 'not-allowed' : 'pointer',
          background: `linear-gradient(to right, var(--background-color-primary-main) ${pct}%, var(--background-color-surface-elevation-3) ${pct}%)`,
          outline: 'none',
        }}
        className="omr-range"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .omr-range::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:999px; background:var(--background-color-solid); border:2px solid var(--background-color-primary-main); box-shadow:0 1px 4px rgba(12,13,15,0.3); cursor:pointer; }
        .omr-range::-moz-range-thumb{ width:20px; height:20px; border-radius:999px; background:var(--background-color-solid); border:2px solid var(--background-color-primary-main); box-shadow:0 1px 4px rgba(12,13,15,0.3); cursor:pointer; }
      ` }} />
    </div>
  );
}
