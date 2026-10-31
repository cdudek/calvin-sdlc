import React from 'react';
import patterns from '../../patterns/patterns-data.js';

/* ──────────────────────────────────────────────────────────────
   OMR Background Patterns — the "Background Patterns" kit frame.

   Four pattern groups — rising-squares, floating-bulbs, bubbles,
   party-mix — each in a `filled` and an `outline` version. They sit
   subtly in the background of a slide or poster and give the OMR vibe,
   but must never distract from the foreground.

   BINDING colour rule: the pattern shape is always exactly ONE shade
   away from the background colour (bg Purple Strong → pattern Purple
   Medium; bg Purple Soft (lightest) → one step darker; same for every
   family). That keeps the pattern quiet and in the background.

   BINDING contrast rule: a background pattern always sits at LOW
   contrast behind the content. Text placed on top must stay fully
   readable. The pattern itself carries NO contour: no stroke, no
   border, no outline around the shapes (the `outline` group art is
   built from filled ring shapes, never from strokes).

   BINDING placement rule: a background pattern is never placed like
   an image or a graphic on the page. It is scaled up so far that it
   bleeds off the frame on all sides, or at minimum on two. Cropped
   shapes at the frame edge are the intended look; a fully visible,
   centred, framed pattern is wrong. `bleed` (default) handles this.

   NEVER place a background pattern on a black or white background.

   BINDING combination rules:
     · Never mix pattern groups — only ONE group per design.
     · Filled + outline of the SAME group may be combined.
     · Different groups never go together (e.g. rising-squares + bubbles ✗).
   ────────────────────────────────────────────────────────────── */

export const patternNames = Object.keys(patterns); // rising-squares, floating-bulbs, bubbles, party-mix

// OMR surface tone → pattern shape colour, exactly one shade off the background.
// Black & white intentionally excluded — no pattern is allowed there.
const patternColorForBg = {
  'purple-strong': '#7337fc', // 700 bg → 600
  'purple-medium': '#8e7bff', // 500 bg → 400
  'purple-soft':   '#d8d4ff', // 100 bg → 200 (one step darker)
  'mint-strong':   '#00adad', // 600 bg → 500
  'mint-medium':   '#33cccc', // 500 bg → 400
  'mint-soft':     '#a6ede8', // 100 bg → 200
  'yellow-strong': '#f5c41c', // 500 bg → 400
  'yellow-medium': '#ffdb75', // 400 bg → 300
  'yellow-soft':   '#fbe69c', // 100 bg → 200
};

/** Pattern shape colour one shade off the given OMR background tone. null on black/white/unknown. */
export function patternColorForBackground(bg) {
  return patternColorForBg[bg] || null;
}

/**
 * OMR background pattern.
 *
 * @param pattern    "rising-squares" | "floating-bulbs" | "bubbles" | "party-mix".
 * @param variant    "filled" (default) | "outline".
 * @param background OMR surface tone — auto-applies the one-shade pattern colour.
 *                   On "black"/"white" nothing renders (patterns are not allowed there).
 * @param color      explicit pattern colour (overrides `background`).
 * @param bleed      default true — the pattern is oversized and cropped by the
 *                   container, so it runs off at least two frame edges.
 *                   Set false only for kit/specimen sheets.
 * @param scale      bleed overscale factor, default 1.35 (135% of the container).
 * @param width/height  default "100%" — the pattern scales to its container.
 */
export function BackgroundPattern({
  pattern = 'rising-squares',
  variant = 'filled',
  background,
  color,
  bleed = true,
  scale = 1.35,
  width = '100%',
  height = '100%',
  preserveAspectRatio,
  className,
  style,
  ...rest
}) {
  const grp = patterns[pattern] || patterns['rising-squares'];
  const d = grp[variant] || grp.filled || grp.outline;
  const resolvedColor = color || (background ? patternColorForBackground(background) : undefined);
  // On black/white (or unknown) with no explicit colour → render nothing.
  if (background && !color && !patternColorForBackground(background)) return null;
  if (!d) return null;
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={d.viewBox}
      preserveAspectRatio={preserveAspectRatio || (bleed ? 'xMidYMid slice' : 'xMidYMid meet')}
      className={className}
      style={{
        color: resolvedColor,
        display: 'block',
        ...(bleed
          ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: `${scale * 100}%`, height: `${scale * 100}%`, pointerEvents: 'none' }
          : null),
        ...style,
      }}
      // emitter-controlled <svg>/<path> markup — geometry + currentColor fills only.
      dangerouslySetInnerHTML={{ __html: d.body }}
      {...rest}
    />
  );
}

export default BackgroundPattern;
