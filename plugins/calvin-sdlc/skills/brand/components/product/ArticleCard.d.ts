import React from 'react';

interface ArticleCardProps {
  title: string;
  category?: string;
  author?: string;
  date?: string;
  image?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
/** Editorial / blog preview card (cover, category, headline, author + date). */
export function ArticleCard(props: ArticleCardProps): React.ReactElement;
