import React from 'react';
import graphics from '../../graphics/graphics-data.js';

/* ──────────────────────────────────────────────────────────────
   OMR Graphic Elements — the "Graphic *" kit families.

   43 shapes, most with a `filled` and an `outline` version; a few
   standalone shapes have a single `solid`. Every shape paints in
   currentColor — recolour via CSS `color`.

   Graphic Elements set focus or act as an eye-catcher ("Störer"):
     · carriers for content (e.g. a numbered circle 1 · 2 · 3)
     · building blocks for your own background patterns (plus/x shapes)
     · a soft overlay or outline laid over an image
     · zoomed up huge so one element fills ~half the asset and its edge
       splits the layout (image one side, text the other)
   ────────────────────────────────────────────────────────────── */

export const graphicNames = Object.keys(graphics);

/**
 * OMR graphic element.
 *
 * @param name     shape slug (see graphicNames) — e.g. "star", "plus", "big-cross".
 * @param variant  "filled" (default) | "outline". Falls back to whatever the shape has.
 * @param size     pixel size; width follows the shape aspect ratio. Default 48.
 * @param color    CSS colour for the shape (default: inherit currentColor).
 */
export function GraphicElement({
  name = 'star',
  variant = 'filled',
  size = 48,
  color,
  className,
  style,
  ...rest
}) {
  const shape = graphics[name] || graphics.star;
  const d = shape[variant] || shape.filled || shape.solid || shape.outline;
  if (!d) return null;
  const [w, h] = d.viewBox.split(' ').slice(2).map(Number);
  const height = size;
  const width = (size * w) / h;
  return (
    <svg
      role="img"
      aria-label={name}
      width={width}
      height={height}
      viewBox={d.viewBox}
      className={className}
      style={{ color, display: 'inline-block', flexShrink: 0, ...style }}
      // emitter-controlled <path>/<svg> markup — geometry + currentColor fills only.
      dangerouslySetInnerHTML={{ __html: d.body }}
      {...rest}
    />
  );
}

export default GraphicElement;

/* ──────────────────────────────────────────────────────────────
   Per-family named components (the "Graphic *" kit families).
   Thin wrappers over GraphicElement so each Figma family is a
   first-class, kit-named component. Pass `variant`/`size`/`color`.
   ────────────────────────────────────────────────────────────── */
export function GraphicAlien(props) { return React.createElement(GraphicElement, { name: "alien", ...props }); }
export function GraphicArc(props) { return React.createElement(GraphicElement, { name: "arc", ...props }); }
export function GraphicBigCross(props) { return React.createElement(GraphicElement, { name: "big-cross", ...props }); }
export function GraphicBigCylinder(props) { return React.createElement(GraphicElement, { name: "big-cylinder", ...props }); }
export function GraphicBigPears(props) { return React.createElement(GraphicElement, { name: "big-pears", ...props }); }
export function GraphicBigStar(props) { return React.createElement(GraphicElement, { name: "big-star", ...props }); }
export function GraphicChecks(props) { return React.createElement(GraphicElement, { name: "checks", ...props }); }
export function GraphicCircleAndSquare(props) { return React.createElement(GraphicElement, { name: "circle-and-square", ...props }); }
export function GraphicCircle(props) { return React.createElement(GraphicElement, { name: "circle", ...props }); }
export function GraphicCircleWithWart(props) { return React.createElement(GraphicElement, { name: "circle-with-wart", ...props }); }
export function GraphicCross(props) { return React.createElement(GraphicElement, { name: "cross", ...props }); }
export function GraphicCube(props) { return React.createElement(GraphicElement, { name: "cube", ...props }); }
export function GraphicDirection(props) { return React.createElement(GraphicElement, { name: "direction", ...props }); }
export function GraphicDonut(props) { return React.createElement(GraphicElement, { name: "donut", ...props }); }
export function GraphicDotSquare(props) { return React.createElement(GraphicElement, { name: "dot-square", ...props }); }
export function GraphicFlower(props) { return React.createElement(GraphicElement, { name: "flower", ...props }); }
export function GraphicGalaxy(props) { return React.createElement(GraphicElement, { name: "galaxy", ...props }); }
export function GraphicIntersept(props) { return React.createElement(GraphicElement, { name: "intersept", ...props }); }
export function GraphicLadder(props) { return React.createElement(GraphicElement, { name: "ladder", ...props }); }
export function GraphicMinus(props) { return React.createElement(GraphicElement, { name: "minus", ...props }); }
export function GraphicMoon(props) { return React.createElement(GraphicElement, { name: "moon", ...props }); }
export function GraphicMorphingBlob(props) { return React.createElement(GraphicElement, { name: "morphing-blob", ...props }); }
export function GraphicPearls(props) { return React.createElement(GraphicElement, { name: "pearls", ...props }); }
export function GraphicPentagon(props) { return React.createElement(GraphicElement, { name: "pentagon", ...props }); }
export function GraphicPlus(props) { return React.createElement(GraphicElement, { name: "plus", ...props }); }
export function GraphicRhombus(props) { return React.createElement(GraphicElement, { name: "rhombus", ...props }); }
export function GraphicSimpleStar(props) { return React.createElement(GraphicElement, { name: "simple-star", ...props }); }
export function GraphicSmallCylinder(props) { return React.createElement(GraphicElement, { name: "small-cylinder", ...props }); }
export function GraphicSmallStar(props) { return React.createElement(GraphicElement, { name: "small-star", ...props }); }
export function GraphicSnowflake(props) { return React.createElement(GraphicElement, { name: "snowflake", ...props }); }
export function GraphicSoother(props) { return React.createElement(GraphicElement, { name: "soother", ...props }); }
export function GraphicSpiral(props) { return React.createElement(GraphicElement, { name: "spiral", ...props }); }
export function GraphicSquare(props) { return React.createElement(GraphicElement, { name: "square", ...props }); }
export function GraphicSquareShield(props) { return React.createElement(GraphicElement, { name: "square-shield", ...props }); }
export function GraphicStackedHalfCircles(props) { return React.createElement(GraphicElement, { name: "stacked-half-circles", ...props }); }
export function GraphicStar(props) { return React.createElement(GraphicElement, { name: "star", ...props }); }
export function GraphicStones(props) { return React.createElement(GraphicElement, { name: "stones", ...props }); }
export function GraphicStripedCircle(props) { return React.createElement(GraphicElement, { name: "striped-circle", ...props }); }
export function GraphicSuperNova(props) { return React.createElement(GraphicElement, { name: "super-nova", ...props }); }
export function GraphicTriangeSquare(props) { return React.createElement(GraphicElement, { name: "triange-square", ...props }); }
export function GraphicTriangle(props) { return React.createElement(GraphicElement, { name: "triangle", ...props }); }
export function GraphicWaveSharp(props) { return React.createElement(GraphicElement, { name: "wave-sharp", ...props }); }
export function GraphicWaveSoft(props) { return React.createElement(GraphicElement, { name: "wave-soft", ...props }); }
