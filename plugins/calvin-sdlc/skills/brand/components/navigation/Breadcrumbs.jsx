import React from 'react';

/** Chevron-right separator — 14px, grey-700, 4px horizontal margin (mx-1). */
function Sep({ dir = 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-grey-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 4px', flex: 'none', verticalAlign: 'middle' }} aria-hidden="true">
      {dir === 'right' ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
    </svg>
  );
}

function Crumb({ item, active, onNavigate, index }) {
  const [hover, setHover] = React.useState(false);
  if (active || !item.href) {
    // Current page — black, not a link.
    return <span className="txt-body-s-regular" style={{ color: 'var(--color-grey-1000)' }} aria-current={active ? 'page' : undefined}>{item.label}</span>;
  }
  return (
    <a
      href={item.href}
      onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(item, index); } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="txt-body-s-regular"
      style={{ color: hover ? 'var(--color-purple-600)' : 'var(--color-purple-500)', textDecoration: 'none' }}
    >
      {item.label}
    </a>
  );
}

/**
 * Breadcrumb trail. Mirrors OMR core-ui `Breadcrumbs`: a bar with top+bottom
 * hairline borders (border-y / grey-200) and 8px vertical padding, chevron-right
 * separators (grey-700), purple-500 links (→ purple-600 on hover) and a black
 * current page. `items` = [{ label, href? }]; the last item is the current page.
 * With `shortOnMobile`, narrow viewports collapse to a single "‹ back" crumb
 * pointing at the parent (the second-to-last item).
 */
export function Breadcrumbs({ items = [], onNavigate, shortOnMobile = false, style }) {
  const prev = items[items.length - 2];
  const barStyle = {
    borderTop: '1px solid var(--color-grey-200)',
    borderBottom: '1px solid var(--color-grey-200)',
    padding: '8px 0',
    ...style,
  };
  return (
    <nav aria-label="Breadcrumb" style={barStyle}>
      {/* Full trail */}
      <ol
        style={{
          listStyle: 'none', margin: 0, padding: 0,
          display: shortOnMobile ? 'none' : 'flex',
          alignItems: 'center', flexWrap: 'wrap',
        }}
        data-breadcrumb-full={shortOnMobile ? '' : undefined}
      >
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <Crumb item={it} active={last} onNavigate={onNavigate} index={i} />
              {!last && <Sep />}
            </li>
          );
        })}
      </ol>
      {/* Short (mobile) variant — parent link with a back chevron */}
      {shortOnMobile && prev && (
        <div style={{ display: 'flex', alignItems: 'center' }} data-breadcrumb-short="">
          <Sep dir="left" />
          <Crumb item={prev} onNavigate={onNavigate} index={items.length - 2} />
        </div>
      )}
    </nav>
  );
}
