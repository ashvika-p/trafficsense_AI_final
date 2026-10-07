import {
  HiOutlineMap,
  HiOutlineClock,
  HiOutlineCpuChip,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import KpiCard from '../components/KpiCard';
import CongestionBadge from '../components/CongestionBadge';
import { useCity } from '../context/CityContext';
import {
  generateTrend,
  generatePeakHours,
  generateDistribution,
  averageCongestion,
  averageDelay,
} from '../data/chartGenerators';
import type { PredictionRecord } from '../types';
import {
  palette,
  congestionBarFill,
  chartTooltipStyle,
  chartAxisTick,
  chartAxisTickSm,
} from '../theme/palette';

import { recentPredictions } from '../data/mockData';

export default function Dashboard() {
  const { city } = useCity();
  const trendData = generateTrend(city);
  const peakHourData = generatePeakHours(city);
  const congestionDistribution = generateDistribution(city);
  const displayPredictions = recentPredictions.slice(0, 7);
  const avgCongestion = averageCongestion(city);
  const avgDelay = averageDelay(city);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-secondary">Traffic Intelligence Dashboard</h1>
        <p className="text-sm text-cream/55">
          Real-time overview of {city.name}'s traffic zones, congestion patterns, and AI predictions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Active Traffic Zones"
          value={String(city.zones.length)}
          change={4.2}
          icon={<HiOutlineMap className="h-5 w-5" />}
        />
        <KpiCard
          label="Average Congestion"
          value={`${avgCongestion}%`}
          change={-3.1}
          icon={<HiOutlineChartBar className="h-5 w-5" />}
          iconBg="bg-warning/10"
          iconColor="text-warning"
        />
        <KpiCard
          label="Predicted Delay"
          value={`${avgDelay} min`}
          change={2.5}
          icon={<HiOutlineClock className="h-5 w-5" />}
          iconBg="bg-danger/10"
          iconColor="text-danger"
        />
        <KpiCard
          label="AI Accuracy"
          value={`${city.aiAccuracy}%`}
          change={1.4}
          icon={<HiOutlineCpuChip className="h-5 w-5" />}
          iconBg="bg-accent/10"
          iconColor="text-accent"
        />
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Traffic Trend Chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-secondary">Traffic Trend &mdash; Today</h3>
              <p className="text-xs text-cream/45">Actual vs AI-predicted congestion (%) in {city.name}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Actual</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" />Predicted</span>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.bordo} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={palette.bordo} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.greenLight} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={palette.greenLight} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={palette.grid} />
                <XAxis dataKey="time" tick={chartAxisTick} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="congestion" stroke={palette.bordo} strokeWidth={2.5} fill="url(#actualGrad)" />
                <Area type="monotone" dataKey="predicted" stroke={palette.greenLight} strokeWidth={2} strokeDasharray="4 3" fill="url(#predGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Congestion Distribution */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-secondary">Congestion Distribution</h3>
          <p className="text-xs text-cream/45">Share of zones by congestion level</p>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={congestionDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {congestionDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-secondary/60">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table + Peak Hour Analysis */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Predictions Table */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="border-b border-cream/10 px-6 py-5">
            <h3 className="text-base font-semibold text-secondary">Recent Predictions</h3>
            <p className="text-xs text-cream/45">Latest AI-generated traffic predictions across {city.name} zones</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream/10 text-xs uppercase tracking-wide text-cream/45">
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Congestion</th>
                  <th className="px-6 py-3 font-medium">Delay</th>
                  <th className="px-6 py-3 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {displayPredictions.map((p) => (
                  <tr key={p.id} className="border-b border-cream/10 last:border-0 hover:bg-green-100/80">
                    <td className="px-6 py-3.5 font-mono text-xs text-cream/55">{p.id}</td>
                    <td className="px-6 py-3.5 font-medium text-secondary">{p.location}</td>
                    <td className="px-6 py-3.5 text-cream/55">{p.time}</td>
                    <td className="px-6 py-3.5"><CongestionBadge level={p.congestion} /></td>
                    <td className="px-6 py-3.5 text-cream/70">{p.delay} min</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-green-100">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${p.confidence}%` }} />
                        </div>
                        <span className="text-xs text-cream/55">{p.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Peak Hour Analysis */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-secondary">Peak Hour Analysis</h3>
          <p className="text-xs text-cream/45">Congestion intensity by hour block</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHourData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={palette.grid} />
                <XAxis type="number" tick={chartAxisTickSm} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="hour"
                  type="category"
                  width={64}
                  tick={chartAxisTickSm}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="congestion" radius={[0, 6, 6, 0]}>
                  {peakHourData.map((entry, idx) => (
                    <Cell key={idx} fill={congestionBarFill(entry.congestion)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
