import React from 'react';

// kebab-case → PascalCase (lucide global keys are PascalCase)
function toPascal(name) {
  return String(name).split(/[-_ ]/).filter(Boolean).map((s) => s[0].toUpperCase() + s.slice(1)).join('');
}

// Common renames between old lucide names and current PascalCase keys
const ALIASES = { Home: 'House', Search: 'Search', Login: 'LogIn', Logout: 'LogOut' };

function resolve(name) {
  const g = typeof window !== 'undefined' ? window.lucide : null;
  if (!g) return null;
  const pascal = toPascal(name);
  const key = (g[pascal] && pascal) || (ALIASES[pascal] && g[ALIASES[pascal]] && ALIASES[pascal]);
  const node = key ? g[key] : g[pascal];
  return node || null;
}

/**
 * Icon — thin wrapper over Lucide (OMR's icon system). Renders a
 * currentColor stroke icon; recolour with a `text-icon-*` class or `color`.
 * Requires the Lucide UMD script (window.lucide) to be loaded on the page.
 */
export function Icon({ name, size = 24, strokeWidth = 2, color, className, style, ...rest }) {
  const [, force] = React.useReducer((n) => n + 1, 0);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !window.lucide) {
      let tries = 0;
      const t = setInterval(() => {
        tries += 1;
        if (window.lucide || tries > 40) { clearInterval(t); force(); }
      }, 50);
      return () => clearInterval(t);
    }
  }, []);

  const node = resolve(name);
  const base = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  const wrapStyle = { display: 'inline-block', flexShrink: 0, color, verticalAlign: 'middle', ...style };

  if (!node) {
    // graceful placeholder until lucide loads / unknown name
    return <svg {...base} className={className} style={wrapStyle} aria-hidden="true" {...rest}><rect x="3" y="3" width="18" height="18" rx="2" opacity="0.25" /></svg>;
  }

  // node is either ['svg', attrs, children] or an array of [tag, attrs] children
  const children = Array.isArray(node) && typeof node[0] === 'string' && node[0] === 'svg' ? node[2] : node;

  return (
    <svg {...base} className={className} style={wrapStyle} aria-hidden="true" {...rest}>
      {(children || []).map((child, i) => {
        const [tag, attrs] = child;
        return React.createElement(tag, { key: i, ...attrs });
      })}
    </svg>
  );
}
