import React from 'react';

function PageBtn({ children, active, disabled, onClick, ariaLabel }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel} aria-current={active ? 'page' : undefined}
      className={`txt-body-m-bold ${disabled ? '' : 'state-layer-neutral'} omr-focus-visible-outline`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, height: 40, padding: '0 8px',
        border: `1px solid ${active ? 'var(--border-color-selected)' : 'var(--border-color-main)'}`, borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--background-color-primary-subtle)' : 'var(--background-color-surface)',
        color: active ? 'var(--text-color-selected)' : 'var(--text-color-main)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, fontVariantNumeric: 'tabular-nums',
      }}>{children}</button>
  );
}

/** Page-number pagination with prev/next and ellipses for long ranges. */
export function Pagination({ page = 1, pageCount = 1, onChange, style }) {
  const go = (p) => { if (p >= 1 && p <= pageCount && onChange) onChange(p); };
  const pages = [];
  const push = (p) => pages.push(p);
  const range = 1;
  for (let p = 1; p <= pageCount; p++) {
    if (p === 1 || p === pageCount || (p >= page - range && p <= page + range)) push(p);
    else if (pages[pages.length - 1] !== '…') push('…');
  }
  const chev = (d) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points={d === 'l' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} /></svg>;
  return (
    <nav aria-label="Pagination" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...style }}>
      <PageBtn onClick={() => go(page - 1)} disabled={page <= 1} ariaLabel="Previous page">{chev('l')}</PageBtn>
      {pages.map((p, i) => p === '…'
        ? <span key={'e' + i} className="txt-body-m-regular text-subtlest" style={{ padding: '0 4px' }}>…</span>
        : <PageBtn key={p} active={p === page} onClick={() => go(p)} ariaLabel={`Page ${p}`}>{p}</PageBtn>)}
      <PageBtn onClick={() => go(page + 1)} disabled={page >= pageCount} ariaLabel="Next page">{chev('r')}</PageBtn>
    </nav>
  );
}
