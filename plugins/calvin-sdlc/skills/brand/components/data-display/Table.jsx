import React from 'react';

/**
 * Table — simple data table. `columns` = [{ key, label, align?, width? }],
 * `rows` = array of objects keyed by column key. Optional row click.
 * Cell content can be any node (badges, avatars, links).
 */
export function Table({ columns = [], rows = [], onRowClick, style }) {
  return (
    <div style={{ border: '1px solid var(--border-color-main)', borderRadius: 'var(--radius-card)', overflow: 'hidden', ...style }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
        <thead>
          <tr style={{ background: 'var(--background-color-surface-elevation-2)' }}>
            {columns.map((c) => (
              <th key={c.key} className="txt-label-s-bold-uppercase text-subtle"
                style={{ textAlign: c.align || 'left', padding: '12px 16px', width: c.width, whiteSpace: 'nowrap', borderBottom: '1px solid var(--border-color-main)' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} onClick={() => onRowClick && onRowClick(r, ri)}
              style={{ cursor: onRowClick ? 'pointer' : 'default', background: 'var(--background-color-surface)' }}
              onMouseEnter={(e) => { if (onRowClick) e.currentTarget.style.background = 'var(--background-color-surface-elevation-1)'; }}
              onMouseLeave={(e) => { if (onRowClick) e.currentTarget.style.background = 'var(--background-color-surface)'; }}>
              {columns.map((c, ci) => (
                <td key={c.key} className="txt-body-s-regular text-main"
                  style={{ textAlign: c.align || 'left', padding: '14px 16px', borderTop: ri === 0 ? 'none' : '1px solid var(--border-color-subtle)', verticalAlign: 'middle' }}>
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
