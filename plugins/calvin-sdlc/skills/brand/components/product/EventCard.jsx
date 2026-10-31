import React from 'react';

/**
 * EventCard — event/session tile with a date chip, title, location and time.
 * `tag` colours a small status chip (e.g. Keynote / Talk).
 */
export function EventCard({ title, day, month, location, time, tag, image, onClick, style }) {
  return (
    <div onClick={onClick} className={onClick ? 'omr-eventcard' : undefined}
      style={{ display: 'flex', flexDirection: 'column', background: 'var(--background-color-surface-elevation-1)',
        border: '1px solid var(--border-color-main)', borderRadius: 'var(--radius-card)', overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default', transition: 'var(--transition-border)', ...style }}>
      <div style={{ position: 'relative', height: 140, background: image ? `center/cover url('${image}')` : 'linear-gradient(120deg,#060708,#42169c)' }}>
        {(day || month) && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--background-color-surface)', borderRadius: 'var(--radius-lg)', padding: '4px 10px', textAlign: 'center', lineHeight: 1.1 }}>
            <div className="txt-headline-m-bold text-main">{day}</div>
            <div className="txt-label-s-bold-uppercase text-subtle">{month}</div>
          </div>
        )}
        {tag && <div style={{ position: 'absolute', top: 12, right: 12 }}><span className="txt-label-s-bold-uppercase" style={{ padding: '3px 8px', borderRadius: 'var(--radius-lg)', background: 'var(--background-color-primary-main)', color: 'var(--text-color-inverse)' }}>{tag}</span></div>}
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3 className="txt-headline-m-bold text-main" style={{ margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {location && <span className="txt-body-s-regular text-subtle">{location}</span>}
          {time && <span className="txt-body-s-regular text-subtlest" style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</span>}
        </div>
      </div>
    </div>
  );
}
