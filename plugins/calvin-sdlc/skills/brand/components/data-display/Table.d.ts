import React from 'react';

interface Column { key: string; label: React.ReactNode; align?: 'left' | 'center' | 'right'; width?: string | number; }
interface TableProps {
  columns: Column[];
  rows: Record<string, React.ReactNode>[];
  onRowClick?: (row: Record<string, React.ReactNode>, index: number) => void;
  style?: React.CSSProperties;
}
/** Simple data table; cell values may be any node. */
export function Table(props: TableProps): React.ReactElement;
