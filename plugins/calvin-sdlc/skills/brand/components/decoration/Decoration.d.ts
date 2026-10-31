import * as React from 'react';

/** Decoration number — "01", "03" … "17". */
export type DecorationName = string;
export type DecorationDirection = 'left' | 'right';

export const decorationNames: DecorationName[];

/** The nine brand-kit colours, the only colours for decorations. No black, no white. */
export const decorationColors: string[];

/** The same colours by family (strong · medium · soft). */
export const decorationColorFamilies: { purple: string[]; mint: string[]; yellow: string[] };

/** Decorations released for title slides and chapter dividers (CLAUDE.md §8). */
export const titleSlideDecorations: DecorationName[];

/** Rotation of the released elements: freely rotatable or 45° steps only. */
export const titleSlideRotation: { free: DecorationName[]; step45: DecorationName[] };

/** 'free' | 'step45' | null (null = not permitted on title slides). */
export function titleSlideRotationFor(name: DecorationName): 'free' | 'step45' | null;

/** Colour tweak: chooses the combination, not a single uniform colour. Returns [A, B]. */
export function decorationCombo(clicked: string, currentB?: string, background?: string): [string, string];

export interface DecorationProps extends React.SVGProps<SVGSVGElement> {
  /** Decoration number, "01", "03" … "17". */
  name?: DecorationName;
  /** "left" (default) or "right". */
  direction?: DecorationDirection;
  /** Pixel height; width follows the aspect ratio. Default 96. */
  size?: number;
  /** Two colours from `decorationColors`: [base shape, accent shape]. Never identical, never equal to the background. */
  colors?: string | string[];
}

/**
 * OMR decoration element — restrained supporting corner decoration that adds
 * OMR character. 16 designs × left/right. Carries its own two-tone OMR colours.
 *
 * BINDING rules:
 *  · The standard way to design an OMR title or chapter slide.
 *  · ONE kind per slide — never combine different decoration elements.
 *  · Up to 3 instances of that one element per page.
 *  · Never mix decorations with background patterns (either/or; decorations are the default).
 *  · Colours: both free from the nine brand-kit colours (`decorationColors`), always
 *    two-coloured, never identical, never equal to the background, no black/white.
 *  · On title slides and chapter dividers only `titleSlideDecorations`; 07/08/11/17
 *    freely rotatable, 03/04/06/14/16 in 45° steps only.
 *  · Never pull focus, never overlap key motifs or text.
 */
export declare const Decoration: React.FC<DecorationProps>;
export default Decoration;

/** Per-family named components (the "Decoration 01…17" kit families) — Decoration with a fixed `name`. */
export type DecorationFamilyProps = Omit<DecorationProps, "name">;
export declare const Decoration01: React.FC<DecorationFamilyProps>;
export declare const Decoration03: React.FC<DecorationFamilyProps>;
export declare const Decoration04: React.FC<DecorationFamilyProps>;
export declare const Decoration05: React.FC<DecorationFamilyProps>;
export declare const Decoration06: React.FC<DecorationFamilyProps>;
export declare const Decoration07: React.FC<DecorationFamilyProps>;
export declare const Decoration08: React.FC<DecorationFamilyProps>;
export declare const Decoration09: React.FC<DecorationFamilyProps>;
export declare const Decoration10: React.FC<DecorationFamilyProps>;
export declare const Decoration11: React.FC<DecorationFamilyProps>;
export declare const Decoration12: React.FC<DecorationFamilyProps>;
export declare const Decoration13: React.FC<DecorationFamilyProps>;
export declare const Decoration14: React.FC<DecorationFamilyProps>;
export declare const Decoration15: React.FC<DecorationFamilyProps>;
export declare const Decoration16: React.FC<DecorationFamilyProps>;
export declare const Decoration17: React.FC<DecorationFamilyProps>;
