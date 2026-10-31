import React from 'react';

interface BtnLinkProps {
  href?: string;
  /** color = brand purple · neutral = inherits/ink text colour. */
  variant?: 'color' | 'neutral';
  size?: 'l' | 'm' | 's';
  /** Force the underline on at rest (otherwise underline shows on hover only). */
  underline?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

interface InlineLinkProps {
  href?: string;
  variant?: 'color' | 'neutral';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Standalone link styled as a text button — no underline until hover. */
export function BtnLink(props: BtnLinkProps): React.ReactElement;
/** Inline prose hyperlink — always underlined. */
export function InlineLink(props: InlineLinkProps): React.ReactElement;
