import React from 'react';

const BG = ['#7337fc', '#00adad', '#2977ff', '#f2b200', '#ef4463', '#10b992'];
function idx(s, n) { let h = 0; for (const c of (s || '')) h = (h * 31 + c.charCodeAt(0)) % 997; return h % n; }

/** SpeakerCard — OMR Festival speaker tile: avatar, name, role, talk topic. */
export function SpeakerCard({ name, role, topic, image, onClick, style }) {
  const bg = BG[idx(name, BG.length)];
  const initials = (name || '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div onClick={onClick} className={onClick ? 'omr-speakercard' : undefined}
      style={{ display: 'flex', gap: 16, padding: 20, borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color-main)', background: 'var(--background-color-surface-elevation-1)',
        cursor: onClick ? 'pointer' : 'default', transition: 'var(--transition-border)', ...style }}>
      <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)', flex: 'none', overflow: 'hidden', background: image ? 'var(--background-color-surface-elevation-2)' : bg, color: bg === '#f2b200' ? 'var(--text-color-main)' : 'var(--text-color-solid-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 23, fontFamily: 'var(--font-sans)' }}>
        {image ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
      </div>
      <div>
        <div className="txt-headline-m-bold text-main">{name}</div>
        <div className="txt-body-s-regular text-subtlest" style={{ marginBottom: 8 }}>{role}</div>
        {topic && <div className="txt-body-s-medium text-primary">{topic}</div>}
      </div>
    </div>
  );
}
