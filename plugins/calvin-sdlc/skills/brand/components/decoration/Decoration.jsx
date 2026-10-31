import React from 'react';
import decorations from '../../decorations/decorations-data.js';

/* ──────────────────────────────────────────────────────────────
   OMR Decoration Elements — the "Decoration 01…17" kit families.

   16 supporting decorations, each in a `left` and `right` direction.
   They add OMR character to a corner of a slide or poster and turn a
   visual into a recognisable OMR visual.

   Deliberately restrained: they SUPPORT the layout, never pull focus,
   never sit in the foreground, and never overlap key motifs or text.
   Decorations are built from the brand-kit palette and are always
   two-coloured. Both colours are chosen freely from the nine brand-kit
   colours (`decorationColors`), within a family as well as across
   families. No black, no white. The `colors` prop takes [base shape,
   accent shape]; the base shape is the shape drawn first.

   BINDING usage rules:
     · Decoration elements are the STANDARD way to design an OMR
       document — a title or chapter slide gets its OMR character here.
     · ONE kind per slide. Different decoration elements are never
       combined on the same slide.
     · Up to 3 instances of that one element may compose a page.
     · Decorations and background patterns are never mixed: a design
       has either a subtle background pattern OR decoration elements.
   ────────────────────────────────────────────────────────────── */

export const decorationNames = Object.keys(decorations); // "01", "03".."17"

/** The nine brand-kit colours, the only colours a decoration is built
 *  from. Every combination of two of these values is permitted, within a
 *  family as well as across families.
 *  No #000000, no #ffffff, neither as fill nor as outline. */
export const decorationColors = [
  '#8259ff', '#8e7bff', '#ada6fc',
  '#00adad', '#33cccc', '#80e0db',
  '#f2b200', '#f5c41c', '#ffdb75',
];

/** By family (strong · medium · soft). */
export const decorationColorFamilies = {
  purple: ['#8259ff', '#8e7bff', '#ada6fc'],
  mint: ['#00adad', '#33cccc', '#80e0db'],
  yellow: ['#f2b200', '#f5c41c', '#ffdb75'],
};

/** Decoration elements released for title slides and chapter dividers
 *  (CLAUDE.md §8). All other elements are not permitted there; for other
 *  asset types there is no restriction. */
export const titleSlideDecorations = ['03', '04', '06', '07', '08', '11', '14', '16', '17'];

/** Rotation of the released elements: `free` freely rotatable, `step45` in
 *  45° steps only (CLAUDE.md §8). */
export const titleSlideRotation = {
  free: ['07', '08', '11', '17'],
  step45: ['03', '04', '06', '14', '16'],
};

/** Permitted rotation for an element on title slides: 'free' | 'step45' | null
 *  (null = not permitted on title slides). */
export function titleSlideRotationFor(name) {
  if (titleSlideRotation.free.includes(name)) return 'free';
  if (titleSlideRotation.step45.includes(name)) return 'step45';
  return null;
}

const FAMILY_ORDER = ['purple', 'mint', 'yellow'];
const norm = (c) => String(c || '').trim().toLowerCase();
function locate(color) {
  const c = norm(color);
  for (const family of FAMILY_ORDER) {
    const step = decorationColorFamilies[family].indexOf(c);
    if (step > -1) return { family, step };
  }
  return null;
}

/**
 * Colour tweak: chooses the COMBINATION, not a single uniform colour.
 * Slot A takes the clicked colour. Slot B keeps its colour family; its
 * step follows A's so that the combination holds up.
 * B moves to another family only if A and B would otherwise sit in the
 * same family on the same step, or if B equals the background colour.
 * A and B are always different afterwards and never equal to the
 * background.
 *
 * @param clicked     the clicked colour → slot A
 * @param currentB    previous slot B (its family is kept)
 * @param background  background colour of the slide, avoided
 * @returns [A, B]
 */
export function decorationCombo(clicked, currentB, background) {
  const bg = norm(background);
  const a = locate(clicked) ? norm(clicked) : decorationColors[0];
  const { family: familyA, step: stepA } = locate(a);
  const prev = locate(currentB);
  const pick = (family) => decorationColorFamilies[family][stepA];
  let familyB = prev ? prev.family : FAMILY_ORDER.find((f) => f !== familyA);
  if (familyB === familyA || norm(pick(familyB)) === bg) {
    familyB = FAMILY_ORDER.find((f) => f !== familyA && norm(pick(f)) !== bg)
      || FAMILY_ORDER.find((f) => f !== familyA);
  }
  let b = pick(familyB);
  if (norm(b) === bg || norm(b) === a) {
    b = decorationColorFamilies[familyB].find((c) => norm(c) !== bg && norm(c) !== a) || b;
  }
  return [a, b];
}

/* Two-colour painting: the decoration keeps its template structure and is
   only recoloured. The base shape is the shape drawn FIRST (in the template
   the base shape sits at the bottom of the stack); its source colour becomes
   colour 1, every other source colour becomes colour 2. With one colour the
   whole decoration runs in a single colour. */
function paint(body, colors) {
  const list = (Array.isArray(colors) ? colors : [colors]).filter(Boolean);
  if (!list.length) return body;
  const tags = body.match(/<path\b[^>]*>/g) || [];
  if (!tags.length) return body;
  const fillOf = (tag) => {
    const m = /\sfill="([^"]*)"/.exec(tag);
    return m ? m[1] : 'currentColor';
  };
  const baseFill = fillOf(tags[0]);
  const accent = list[1] || list[0];
  return body.replace(/<path\b[^>]*>/g, (tag) => {
    const target = fillOf(tag) === baseFill ? list[0] : accent;
    return /\sfill="[^"]*"/.test(tag)
      ? tag.replace(/\sfill="[^"]*"/, ` fill="${target}"`)
      : tag.replace(/^<path/, `<path fill="${target}"`);
  });
}

/**
 * OMR decoration element.
 *
 * @param name       decoration number — "01" … "17".
 * @param direction  "left" (default) | "right".
 * @param size       pixel height; width follows the aspect ratio. Default 96.
 * @param colors     two colours from `decorationColors`: [base shape,
 *                   accent shape]. The two are never identical and never
 *                   equal to the background colour. Without it the
 *                   decoration keeps its template colours.
 */
export function Decoration({
  name = '01',
  direction = 'left',
  size = 96,
  colors,
  className,
  style,
  ...rest
}) {
  const dec = decorations[name] || decorations['01'];
  const d = dec[direction] || dec.left || dec.right;
  if (!d) return null;
  const [w, h] = d.viewBox.split(' ').slice(2).map(Number);
  const height = size;
  const width = (size * w) / h;
  return (
    <svg
      role="img"
      aria-label={`decoration ${name}`}
      width={width}
      height={height}
      viewBox={d.viewBox}
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      // emitter-controlled <path>/<svg> markup — geometry + numeric fills only.
      dangerouslySetInnerHTML={{ __html: colors ? paint(d.body, colors) : d.body }}
      {...rest}
    />
  );
}

export default Decoration;

/* ──────────────────────────────────────────────────────────────
   Per-family named components (the "Decoration 01…17" kit families).
   Thin wrappers over Decoration. Pass `direction`/`size`.
   ────────────────────────────────────────────────────────────── */
export function Decoration01(props) { return React.createElement(Decoration, { name: "01", ...props }); }
export function Decoration03(props) { return React.createElement(Decoration, { name: "03", ...props }); }
export function Decoration04(props) { return React.createElement(Decoration, { name: "04", ...props }); }
export function Decoration05(props) { return React.createElement(Decoration, { name: "05", ...props }); }
export function Decoration06(props) { return React.createElement(Decoration, { name: "06", ...props }); }
export function Decoration07(props) { return React.createElement(Decoration, { name: "07", ...props }); }
export function Decoration08(props) { return React.createElement(Decoration, { name: "08", ...props }); }
export function Decoration09(props) { return React.createElement(Decoration, { name: "09", ...props }); }
export function Decoration10(props) { return React.createElement(Decoration, { name: "10", ...props }); }
export function Decoration11(props) { return React.createElement(Decoration, { name: "11", ...props }); }
export function Decoration12(props) { return React.createElement(Decoration, { name: "12", ...props }); }
export function Decoration13(props) { return React.createElement(Decoration, { name: "13", ...props }); }
export function Decoration14(props) { return React.createElement(Decoration, { name: "14", ...props }); }
export function Decoration15(props) { return React.createElement(Decoration, { name: "15", ...props }); }
export function Decoration16(props) { return React.createElement(Decoration, { name: "16", ...props }); }
export function Decoration17(props) { return React.createElement(Decoration, { name: "17", ...props }); }
