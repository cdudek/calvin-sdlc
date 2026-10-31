import React from 'react';

/**
 * ArticleCard — editorial / blog preview. Cover image, category tag, headline,
 * author + date. Used across OMR editorial surfaces.
 */
export function ArticleCard({ title, category, author, date, image, onClick, style }) {
  return (
    <article onClick={onClick} className={onClick ? 'omr-articlecard' : undefined}
      style={{ display: 'flex', flexDirection: 'column', background: 'var(--background-color-surface-elevation-1)',
        border: '1px solid var(--border-color-main)', borderRadius: 'var(--radius-card)', overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default', transition: 'var(--transition-border)', ...style }}>
      <div style={{ height: 168, background: image ? `center/cover url('${image}')` : 'linear-gradient(120deg,#7337fc,#8259ff)' }} />
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {category && <span className="txt-label-s-bold-uppercase text-primary">{category}</span>}
        <h3 className="txt-headline-l-bold text-main text-balance" style={{ margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
          <span className="txt-body-s-medium text-subtle">{author}</span>
          {date && <><span className="text-subtlest">·</span><span className="txt-body-s-regular text-subtlest">{date}</span></>}
        </div>
      </div>
    </article>
  );
}
