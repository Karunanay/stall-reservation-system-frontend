import { Stall, StallSize } from "@/types";

// Map configuration
const ROWS = 6;
const COLS = 13;

// Inner square configuration
const INNER_ROW_START = 2;
const INNER_ROW_END = 3;
const INNER_COL_START = 4;
const INNER_COL_END = 8;

function isLayoutCell(r: number, c: number) {
    const isBorder = r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1;
    const isInnerRow = r === INNER_ROW_START || r === INNER_ROW_END;
    const isInnerCol = c === INNER_COL_START || c === INNER_COL_END;
    const isInnerRectBoundary = (isInnerRow && c >= INNER_COL_START && c <= INNER_COL_END) ||
                                (isInnerCol && r >= INNER_ROW_START && r <= INNER_ROW_END);
    return isBorder || isInnerRectBoundary;
}

function getStallName(index: number): string {
    let name = '';
    let n = index;
    while (n >= 0) {
        name = String.fromCharCode((n % 26) + 65) + name;
        n = Math.floor(n / 26) - 1;
    }
    return name;
}

// Simple seeded random number generator
function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function generateStalls(mapId: number, eventIdStr: string = "default"): Stall[] {
    const stalls: Stall[] = [];
    const occupied = new Set<string>();
    let stallCount = 0;
    
    // Seed for layout (consistent per mapId)
    let layoutSeed = mapId * 1000; 
    
    // Seed for status (consistent per mapId + eventId)
    // Simple hash of eventIdStr
    let eventHash = 0;
    for (let i = 0; i < eventIdStr.length; i++) {
        eventHash = ((eventHash << 5) - eventHash) + eventIdStr.charCodeAt(i);
        eventHash |= 0;
    }
    let statusSeed = (mapId * 1000) + Math.abs(eventHash);

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (occupied.has(`${r},${c}`) || !isLayoutCell(r, c)) continue;

            // Determine max possible size and direction
            // Use layoutSeed for structure
            let size = seededRandom(layoutSeed++) < 0.33 ? 1 : seededRandom(layoutSeed++) < 0.5 ? 2 : 3; 
            
            let direction: 'horizontal' | 'vertical' = 'horizontal';
            
            const canGoRight = c + 1 < COLS && isLayoutCell(r, c + 1) && !occupied.has(`${r},${c + 1}`);
            const canGoDown = r + 1 < ROWS && isLayoutCell(r + 1, c) && !occupied.has(`${r + 1},${c}`);

            if (canGoRight && !canGoDown) direction = 'horizontal';
            else if (!canGoRight && canGoDown) direction = 'vertical';
            else if (canGoRight && canGoDown) {
                 // Prefer horizontal for top/bottom walls, vertical for side walls.
                 if (r === 0 || r === ROWS - 1 || r === INNER_ROW_START || r === INNER_ROW_END) direction = 'horizontal';
                 else direction = 'vertical';
            } else {
                size = 1; // Can't grow
            }

            // Adjust size based on availability
            let actualSize = 1;
            if (size > 1) {
                if (direction === 'horizontal') {
                    if (c + 1 < COLS && isLayoutCell(r, c + 1) && !occupied.has(`${r},${c + 1}`)) {
                        actualSize = 2;
                        if (size > 2 && c + 2 < COLS && isLayoutCell(r, c + 2) && !occupied.has(`${r},${c + 2}`)) {
                            actualSize = 3;
                        }
                    }
                } else {
                    if (r + 1 < ROWS && isLayoutCell(r + 1, c) && !occupied.has(`${r + 1},${c}`)) {
                        actualSize = 2;
                        if (size > 2 && r + 2 < ROWS && isLayoutCell(r + 2, c) && !occupied.has(`${r + 2},${c}`)) {
                            actualSize = 3;
                        }
                    }
                }
            }

            const rowSpan = direction === 'vertical' ? actualSize : 1;
            const colSpan = direction === 'horizontal' ? actualSize : 1;

            // Mark occupied
            for (let i = 0; i < rowSpan; i++) {
                for (let j = 0; j < colSpan; j++) {
                    occupied.add(`${r + i},${c + j}`);
                }
            }

            stalls.push({
                id: `${mapId}-stall-${stallCount}`,
                name: `${mapId}-${getStallName(stallCount)}`,
                row: r,
                col: c,
                rowSpan,
                colSpan,
                // Use statusSeed for availability
                status: seededRandom(statusSeed++) > 0.7 ? "reserved" : "available",
                size: actualSize === 1 ? 'small' : actualSize === 2 ? 'medium' : 'large'
            });
            stallCount++;
        }
    }
    return stalls;
}

export const MAP_ROWS = ROWS;
export const MAP_COLS = COLS;
