import React from 'react';
import { RatingStars } from '../data-display/RatingStars.jsx';

const BG = ['#7337fc', '#00adad', '#2977ff', '#f2b200', '#ef4463', '#10b992', '#ff47c6', '#8259ff'];
function idx(s, n) { let h = 0; for (const c of (s || '')) h = (h * 31 + c.charCodeAt(0)) % 997; return h % n; }

/**
 * ProductCard — OMR Reviews software listing card. Blurred cover band, logo
 * overlapping the cover, name, star rating, review count and a CTA link.
 * Pass `logoUrl` for a real logo, otherwise a colour letter-mark is generated.
 */
export function ProductCard({ name, rating, reviewCount = 0, logoUrl, category, ctaLabel = 'All reviews', onClick, style }) {
  const bg = BG[idx(name, BG.length)];
  const initials = (name || '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div onClick={onClick} className="omr-productcard"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        background: 'var(--background-color-surface-elevation-1)', border: '1px solid var(--border-color-main)',
        borderRadius: 'var(--radius-lg)', paddingBottom: 24, cursor: onClick ? 'pointer' : 'default', overflow: 'hidden',
        transition: 'var(--transition-border)', ...style }}>
      <div style={{ height: 72, width: '100%', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: bg, filter: 'blur(28px)', transform: 'scale(1.6)', opacity: 0.55 }} />
      </div>
      <div style={{ marginTop: -32, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-control)', background: logoUrl ? 'var(--background-color-surface)' : bg, color: bg === '#f2b200' ? 'var(--text-color-main)' : 'var(--text-color-solid-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 27, fontFamily: 'var(--font-sans)', overflow: 'hidden', boxShadow: '0 4px 14px -4px rgba(12,13,15,0.25)' }}>
          {logoUrl ? <img src={logoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>
        <div className="txt-headline-m-bold text-main" style={{ marginTop: 12, minHeight: 44, display: 'flex', alignItems: 'center' }}>{name}</div>
        <RatingStars value={rating} size={20} showValue />
        <div className="txt-body-s-regular text-subtle" style={{ marginTop: 4 }}>{reviewCount.toLocaleString('en')} reviews</div>
        {category && <div className="txt-body-s-medium text-primary" style={{ marginTop: 2 }}>{category}</div>}
        <div className="omr-productcard-cta" style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <span className="txt-body-m-bold" style={{ color: 'var(--text-color-link-primary)' }}>{ctaLabel}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-color-link-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </div>
      </div>
    </div>
  );
}
