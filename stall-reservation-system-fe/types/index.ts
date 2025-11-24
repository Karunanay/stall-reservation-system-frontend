export type StallSize = 'small' | 'medium' | 'large';
export type StallStatus = 'reserved' | 'available';

export interface Stall {
  id: string;
  name: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  status: StallStatus;
  size: StallSize;
}

export interface MapConfig {
  id: number;
  rows: number;
  cols: number;
  stalls: Stall[];
}