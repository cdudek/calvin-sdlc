import React from 'react';

const SIZES = { xs: 24, s: 32, m: 40, l: 48, xl: 64, '2xl': 96 };
const BG = ['#7337fc', '#00adad', '#2977ff', '#f2b200', '#ef4463', '#10b992'];
function idx(s, n) { let h = 0; for (const c of (s || '')) h = (h * 31 + c.charCodeAt(0)) % 997; return h % n; }
const STATUS = { online: 'var(--graphic-color-success)', busy: 'var(--border-color-error)', away: 'var(--graphic-color-secondary-strong)' };

/**
 * Avatar — user/company image, initials fallback, optional status dot.
 * `square` (rounded-xs) suits company logos; default is circular.
 */
export function Avatar({ src, name = '', size = 'm', square = false, status, style }) {
  const px = typeof size === 'number' ? size : (SIZES[size] || SIZES.m);
  const radius = square ? 'var(--radius-xs)' : 'var(--radius-full)';
  const bg = BG[idx(name, BG.length)];
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flex: 'none', ...style }}>
      <span style={{ width: px, height: px, borderRadius: radius, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: src ? 'var(--background-color-surface-elevation-2)' : bg, color: bg === '#f2b200' ? 'var(--text-color-main)' : 'var(--text-color-solid-inverse)', fontWeight: 700, fontSize: px * 0.4, fontFamily: 'var(--font-sans)' }}>
        {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (initials || '?')}
      </span>
      {status && (
        <span style={{ position: 'absolute', right: -1, bottom: -1, width: Math.max(8, px * 0.24), height: Math.max(8, px * 0.24), borderRadius: 'var(--radius-full)', background: STATUS[status] || STATUS.online, border: '2px solid var(--background-color-surface)' }} />
      )}
    </span>
  );
}
