import React from 'react';

const STAR = '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2';

function Star({ fill, size }) {
  // fill: 0..1 fraction of the star filled with yellow
  const id = React.useMemo(() => 'sc' + Math.random().toString(36).slice(2), []);
  const yellow = 'var(--graphic-color-secondary-strong)';
  const empty = 'var(--background-color-surface-elevation-4)';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={24 * fill} height="24" />
        </clipPath>
      </defs>
      <polygon points={STAR} fill={empty} />
      <polygon points={STAR} fill={yellow} clipPath={`url(#${id})`} />
    </svg>
  );
}

/**
 * Star rating (0–5). Yellow filled stars over a grey track; supports halves.
 * `dense` shows a single star + numeric value. Rating scale, not a control.
 */
export function RatingStars({ value, size = 16, dense = false, showValue = false, reviewCount, style }) {
  const v = Math.max(0, Math.min(5, value || 0));
  const stars = dense ? [1] : [1, 2, 3, 4, 5];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...style }}>
      <div style={{ display: 'inline-flex', gap: 4 }}>
        {stars.map((i) => {
          const frac = dense ? 1 : Math.max(0, Math.min(1, v - (i - 1)));
          return <Star key={i} fill={frac} size={size} />;
        })}
      </div>
      {(showValue || dense) && (
        <span className="txt-body-s-bold text-main" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {v.toFixed(1)}
        </span>
      )}
      {reviewCount != null && (
        <span className="txt-body-s-regular text-subtlest">({reviewCount.toLocaleString('en')})</span>
      )}
    </div>
  );
}
