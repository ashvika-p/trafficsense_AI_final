import type { CongestionLevel } from '../types';

const styles: Record<CongestionLevel, string> = {
  Low: 'bg-green/80 text-cream',
  Medium: 'bg-cream/15 text-cream',
  High: 'bg-primary text-cream',
};

const dotStyles: Record<CongestionLevel, string> = {
  Low: 'bg-success',
  Medium: 'bg-warning',
  High: 'bg-danger',
};

export default function CongestionBadge({ level }: { level: CongestionLevel }) {
  return (
    <span className={`badge ${styles[level]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[level]}`} />
      {level}
    </span>
  );
}
