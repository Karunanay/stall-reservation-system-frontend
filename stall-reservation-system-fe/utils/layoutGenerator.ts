import { Stall, StallSize } from '@/types/index';

export function generateStalls(hallId: number): Stall[] {
  const stalls: Stall[] = [];
  const rows = 8;
  const cols = 10;

  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      const stallId = `H${hallId}-${row}-${col}`;
      const statuses: Array<'available' | 'reserved'> = ['available', 'reserved'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const sizes: StallSize[] = ['small', 'medium', 'large'];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

      stalls.push({
        id: stallId,
        status: randomStatus,
        row,
        col,
        rowSpan: 1,
        colSpan: 1,
        name: `Stall ${stallId}`,
        size: randomSize,
      });
    }
  }

  return stalls;
}
