import * as React from 'react';

/** Graphic shape slugs (the "Graphic *" kit families). */
export type GraphicName = string;
export type GraphicVariant = 'filled' | 'outline' | 'solid';

/** Every available graphic slug. */
export const graphicNames: GraphicName[];

export interface GraphicElementProps extends React.SVGProps<SVGSVGElement> {
  /** Shape slug — e.g. "star", "plus", "big-cross". */
  name?: GraphicName;
  /** "filled" (default) or "outline". */
  variant?: GraphicVariant;
  /** Pixel size; width follows the shape aspect ratio. Default 48. */
  size?: number;
  /** CSS colour (default: inherit currentColor). */
  color?: string;
}

/**
 * OMR graphic element — decorative focus shape / eye-catcher ("Störer").
 * 43 shapes in filled + outline, painting in currentColor.
 * Use to carry content (numbered circles), build background patterns,
 * overlay images, or blow up huge to split a layout.
 */
export declare const GraphicElement: React.FC<GraphicElementProps>;
export default GraphicElement;

/** Per-family named components (the "Graphic *" kit families) — GraphicElement with a fixed `name`. */
export type GraphicFamilyProps = Omit<GraphicElementProps, "name">;
export declare const GraphicAlien: React.FC<GraphicFamilyProps>;
export declare const GraphicArc: React.FC<GraphicFamilyProps>;
export declare const GraphicBigCross: React.FC<GraphicFamilyProps>;
export declare const GraphicBigCylinder: React.FC<GraphicFamilyProps>;
export declare const GraphicBigPears: React.FC<GraphicFamilyProps>;
export declare const GraphicBigStar: React.FC<GraphicFamilyProps>;
export declare const GraphicChecks: React.FC<GraphicFamilyProps>;
export declare const GraphicCircleAndSquare: React.FC<GraphicFamilyProps>;
export declare const GraphicCircle: React.FC<GraphicFamilyProps>;
export declare const GraphicCircleWithWart: React.FC<GraphicFamilyProps>;
export declare const GraphicCross: React.FC<GraphicFamilyProps>;
export declare const GraphicCube: React.FC<GraphicFamilyProps>;
export declare const GraphicDirection: React.FC<GraphicFamilyProps>;
export declare const GraphicDonut: React.FC<GraphicFamilyProps>;
export declare const GraphicDotSquare: React.FC<GraphicFamilyProps>;
export declare const GraphicFlower: React.FC<GraphicFamilyProps>;
export declare const GraphicGalaxy: React.FC<GraphicFamilyProps>;
export declare const GraphicIntersept: React.FC<GraphicFamilyProps>;
export declare const GraphicLadder: React.FC<GraphicFamilyProps>;
export declare const GraphicMinus: React.FC<GraphicFamilyProps>;
export declare const GraphicMoon: React.FC<GraphicFamilyProps>;
export declare const GraphicMorphingBlob: React.FC<GraphicFamilyProps>;
export declare const GraphicPearls: React.FC<GraphicFamilyProps>;
export declare const GraphicPentagon: React.FC<GraphicFamilyProps>;
export declare const GraphicPlus: React.FC<GraphicFamilyProps>;
export declare const GraphicRhombus: React.FC<GraphicFamilyProps>;
export declare const GraphicSimpleStar: React.FC<GraphicFamilyProps>;
export declare const GraphicSmallCylinder: React.FC<GraphicFamilyProps>;
export declare const GraphicSmallStar: React.FC<GraphicFamilyProps>;
export declare const GraphicSnowflake: React.FC<GraphicFamilyProps>;
export declare const GraphicSoother: React.FC<GraphicFamilyProps>;
export declare const GraphicSpiral: React.FC<GraphicFamilyProps>;
export declare const GraphicSquare: React.FC<GraphicFamilyProps>;
export declare const GraphicSquareShield: React.FC<GraphicFamilyProps>;
export declare const GraphicStackedHalfCircles: React.FC<GraphicFamilyProps>;
export declare const GraphicStar: React.FC<GraphicFamilyProps>;
export declare const GraphicStones: React.FC<GraphicFamilyProps>;
export declare const GraphicStripedCircle: React.FC<GraphicFamilyProps>;
export declare const GraphicSuperNova: React.FC<GraphicFamilyProps>;
export declare const GraphicTriangeSquare: React.FC<GraphicFamilyProps>;
export declare const GraphicTriangle: React.FC<GraphicFamilyProps>;
export declare const GraphicWaveSharp: React.FC<GraphicFamilyProps>;
export declare const GraphicWaveSoft: React.FC<GraphicFamilyProps>;
