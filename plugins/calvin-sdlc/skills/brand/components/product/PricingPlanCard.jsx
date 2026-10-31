import React from 'react';

/**
 * PricingPlanCard — a single pricing tier. Highlighted plans get the brand
 * selection border. `features` is a list of strings; `cta` is a node (Button).
 */
export function PricingPlanCard({ name, price, period = '', features = [], badge, highlight = false, cta, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, borderRadius: 'var(--radius-card)',
      background: 'var(--background-color-surface-elevation-1)',
      border: `1px solid ${highlight ? 'var(--border-color-selected)' : 'var(--border-color-main)'}`,
      outline: highlight ? '1px solid var(--border-color-selected)' : 'none', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="txt-headline-l-bold text-main">{name}</span>
        {badge && <span className="txt-label-s-bold-uppercase" style={{ padding: '2px 8px', borderRadius: 'var(--radius-lg)', background: 'var(--background-color-primary-subtle)', color: 'var(--text-color-selected)' }}>{badge}</span>}
      </div>
      <div><span className="txt-display-s-bold text-main">{price}</span>{period && <span className="txt-body-m-regular text-subtle">{period}</span>}</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {features.map((f, i) => (
          <li key={i} className="txt-body-s-regular text-subtle" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-color-icon-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><polyline points="20 6 9 17 4 12" /></svg>
            {f}
          </li>
        ))}
      </ul>
      {cta}
    </div>
  );
}
