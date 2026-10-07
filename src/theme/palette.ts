/** Brand palette for charts and inline styles (matches tailwind.config.js) */
export const palette = {
  bordo: '#6C151E',
  green: '#0F3D3A',
  cream: '#F5DABF',
  greenLight: '#1A6B65',
  greenMuted: '#1A6B65',
  creamDark: '#E8C49A',
  warning: '#E8C49A',
  grid: 'rgba(245, 218, 191, 0.12)',
  tick: 'rgba(245, 218, 191, 0.55)',
  tooltipBorder: 'rgba(245, 218, 191, 0.2)',
} as const;

export const congestionLevelColors = {
  Low: palette.greenMuted,
  Medium: palette.warning,
  High: palette.bordo,
} as const;

export function congestionBarFill(value: number): string {
  if (value >= 75) return palette.bordo;
  if (value >= 50) return palette.warning;
  return palette.greenMuted;
}

export const chartTooltipStyle = {
  borderRadius: 12,
  border: `1px solid ${palette.tooltipBorder}`,
  fontSize: 12,
  backgroundColor: '#140A0C',
  color: palette.cream,
} as const;

export const chartAxisTick = { fontSize: 11, fill: palette.tick };
export const chartAxisTickSm = { fontSize: 10, fill: palette.tick };
