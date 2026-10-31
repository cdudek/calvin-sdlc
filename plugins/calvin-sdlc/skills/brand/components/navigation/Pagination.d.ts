import React from 'react';

interface PaginationProps {
  page?: number;
  pageCount?: number;
  onChange?: (page: number) => void;
  style?: React.CSSProperties;
}
/** Page-number pagination with prev/next + ellipses. */
export function Pagination(props: PaginationProps): React.ReactElement;
