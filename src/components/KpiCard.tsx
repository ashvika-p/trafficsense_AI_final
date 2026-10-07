import type { ReactNode } from 'react';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

interface KpiCardProps {
  label: string;
  value: string;
  change?: number; // positive or negative percentage
  changeLabel?: string;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
}

export default function KpiCard({
  label,
  value,
  change,
  changeLabel = 'vs last week',
  icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
}: KpiCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-cream/55">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-secondary">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          <span
            className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
              isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}
          >
            {isPositive ? <HiArrowUp className="h-3 w-3" /> : <HiArrowDown className="h-3 w-3" />}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-cream/45">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
