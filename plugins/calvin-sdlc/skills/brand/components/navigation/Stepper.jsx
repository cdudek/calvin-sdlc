import React from 'react';

/**
 * Stepper — horizontal progress through a linear flow, matching the core-ui
 * ProgressStepper. `steps` = [{ label }]. `current` (0-indexed) marks the
 * active step; earlier steps read as completed, later ones as empty.
 * Statuses: completed · active · empty (+ disabled via the `disabled` flag).
 */
export function Stepper({ steps = [], current = 0, disabled = false, style }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', minHeight: 56, ...style }}>
      {steps.map((s, i) => {
        const isDisabled = disabled || s.disabled;
        const done = !isDisabled && i < current;
        const active = !isDisabled && i === current;

        // Circle
        let circleBg = 'transparent';
        let circleBd = 'var(--border-color-primary-subtle)';
        let circleFg = 'var(--text-color-subtle)';
        if (done) { circleBg = 'var(--background-color-primary-strong)'; circleBd = 'var(--border-color-primary-solid)'; circleFg = 'var(--text-color-inverse)'; }
        else if (active) { circleBd = 'var(--border-color-primary-solid)'; circleFg = 'var(--text-color-icon-primary)'; }
        else if (isDisabled) { circleBd = 'var(--border-color-main-solid)'; circleFg = 'var(--text-color-subtlest)'; }

        // Label
        const labelColor = active ? 'var(--text-color-selected)' : isDisabled ? 'var(--text-color-subtlest)' : done ? 'var(--text-color-main)' : 'var(--text-color-subtle)';

        // Connector after this step
        const connectorColor = i < current && !isDisabled ? 'var(--border-color-primary-solid)' : 'var(--border-color-main-solid)';

        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Connector line — sits at circle vertical center */}
            {i < steps.length - 1 && (
              <span style={{ position: 'absolute', top: 11, left: 'calc(50% + 16px)', right: 'calc(-50% + 16px)', borderTop: `2px solid ${connectorColor}` }} />
            )}
            <span
              className="txt-body-s-bold"
              style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 'var(--radius-full)', background: circleBg, border: `2px solid ${circleBd}`, color: circleFg, flex: 'none' }}
            >
              {done
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                : active
                  ? <span style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'currentColor' }} />
                  : null}
            </span>
            <span
              className={active ? 'txt-label-s-bold' : 'txt-label-s-regular'}
              style={{ marginTop: 8, textAlign: 'center', color: labelColor, lineHeight: 1.3, paddingBottom: active ? 6 : 9, borderBottom: active ? '3px solid var(--border-color-primary-solid)' : '3px solid transparent' }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
