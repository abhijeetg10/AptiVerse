// Distinct, aesthetic, accessible color palette tailored to AptiVerse design system
export interface RegionColor {
  name: string;
  fill: string;       // Background color of the region
  border: string;     // Strong border color between distinct regions
  glow: string;       // Subtle glow for active/hover states
  badgeText: string;  // High-contrast text
}

export const REGION_COLORS: RegionColor[] = [
  {
    name: 'Lavender Indigo',
    fill: '#EEF2FF',      // Indigo-50
    border: '#6366F1',    // Indigo-500
    glow: 'rgba(99, 102, 241, 0.25)',
    badgeText: '#3730A3',
  },
  {
    name: 'Warm Amber',
    fill: '#FEF3C7',      // Amber-100
    border: '#F59E0B',    // Amber-500
    glow: 'rgba(245, 158, 11, 0.25)',
    badgeText: '#92400E',
  },
  {
    name: 'Fresh Emerald',
    fill: '#D1FAE5',      // Emerald-100
    border: '#10B981',    // Emerald-500
    glow: 'rgba(16, 185, 129, 0.25)',
    badgeText: '#065F46',
  },
  {
    name: 'Soft Rose',
    fill: '#FFE4E6',      // Rose-100
    border: '#F43F5E',    // Rose-500
    glow: 'rgba(244, 63, 94, 0.25)',
    badgeText: '#9F1239',
  },
  {
    name: 'Sky Cyan',
    fill: '#E0F2FE',      // Sky-100
    border: '#0EA5E9',    // Sky-500
    glow: 'rgba(14, 165, 233, 0.25)',
    badgeText: '#075985',
  },
  {
    name: 'Vibrant Violet',
    fill: '#EDE9FE',      // Violet-100
    border: '#8B5CF6',    // Violet-500
    glow: 'rgba(139, 92, 246, 0.25)',
    badgeText: '#5B21B6',
  },
  {
    name: 'Coral Orange',
    fill: '#FFEDD5',      // Orange-100
    border: '#F97316',    // Orange-500
    glow: 'rgba(249, 115, 22, 0.25)',
    badgeText: '#9A3412',
  },
  {
    name: 'Aqua Teal',
    fill: '#CCFBF1',      // Teal-100
    border: '#14B8A6',    // Teal-500
    glow: 'rgba(20, 184, 166, 0.25)',
    badgeText: '#115E59',
  },
  {
    name: 'Lime Mint',
    fill: '#ECFCCB',      // Lime-100
    border: '#84CC16',    // Lime-500
    glow: 'rgba(132, 204, 22, 0.25)',
    badgeText: '#3F6212',
  },
  {
    name: 'Fuchsia Pink',
    fill: '#FAE8FF',      // Fuchsia-100
    border: '#D946EF',    // Fuchsia-500
    glow: 'rgba(217, 70, 239, 0.25)',
    badgeText: '#86198F',
  },
];

/**
 * Returns the color scheme for a given region ID.
 */
export function getRegionColor(regionId: number): RegionColor {
  return REGION_COLORS[regionId % REGION_COLORS.length];
}

/**
 * Calculates which edges of a cell (r, c) border a DIFFERENT region or the outer boundary.
 */
export function getRegionBorders(
  r: number,
  c: number,
  regions: number[][],
  size: number
): { top: boolean; right: boolean; bottom: boolean; left: boolean } {
  const currentRegion = regions[r]?.[c];
  if (currentRegion === undefined) {
    return { top: false, right: false, bottom: false, left: false };
  }

  const top = r === 0 || regions[r - 1][c] !== currentRegion;
  const right = c === size - 1 || regions[r][c + 1] !== currentRegion;
  const bottom = r === size - 1 || regions[r + 1][c] !== currentRegion;
  const left = c === 0 || regions[r][c - 1] !== currentRegion;

  return { top, right, bottom, left };
}

