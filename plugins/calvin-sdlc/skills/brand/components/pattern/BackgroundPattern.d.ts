import * as React from 'react';

/** Pattern group slug. */
export type PatternName = 'rising-squares' | 'floating-bulbs' | 'bubbles' | 'party-mix';
export type PatternVariant = 'filled' | 'outline';

/** OMR surface tones that carry a pattern colour (black/white excluded — no pattern allowed). */
export type PatternBackground =
  | 'purple-strong' | 'purple-medium' | 'purple-soft'
  | 'mint-strong'   | 'mint-medium'   | 'mint-soft'
  | 'yellow-strong' | 'yellow-medium' | 'yellow-soft';

export const patternNames: PatternName[];

/** Pattern shape colour one shade off the background tone. null on black/white/unknown. */
export function patternColorForBackground(bg: string): string | null;

export interface BackgroundPatternProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  /** Pattern group. Default "rising-squares". */
  pattern?: PatternName;
  /** "filled" (default) or "outline". */
  variant?: PatternVariant;
  /** OMR surface tone — auto-applies the binding one-shade pattern colour. Black/white render nothing. */
  background?: string;
  /** Explicit pattern colour (overrides `background`). */
  color?: string;
  /** Default true — oversized and cropped by the container, running off at least two frame edges. */
  bleed?: boolean;
  /** Bleed overscale factor. Default 1.35. */
  scale?: number;
  width?: number | string;
  height?: number | string;
}

/**
 * OMR background pattern — subtle background artwork giving the OMR vibe.
 *
 * BINDING rules:
 *  · Pattern colour is exactly ONE shade off the background (pass `background`).
 *  · Low contrast behind content, no contour (no stroke/border on the shapes).
 *  · Text may sit over a pattern; check contrast against background AND pattern colour.
 *  · Never on title slides or chapter dividers.
 *  · Never on black or white.
 *  · Never placed like an image — scaled up so it bleeds off at least two frame edges.
 *  · One group per design; filled + outline of the SAME group may combine;
 *    different groups never combine.
 */
export declare const BackgroundPattern: React.FC<BackgroundPatternProps>;
export default BackgroundPattern;
