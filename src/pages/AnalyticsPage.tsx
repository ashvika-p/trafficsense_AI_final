import {
  BarChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { useCity } from '../context/CityContext';
import {
  generatePeakHours,
  generateWeatherImpact,
  generateAreaCongestion,
  generateForecast,
} from '../data/chartGenerators';
import {
  palette,
  congestionBarFill,
  chartTooltipStyle,
  chartAxisTick,
  chartAxisTickSm,
} from '../theme/palette';

export default function AnalyticsPage() {
  const { city } = useCity();
  const peakHourData = generatePeakHours(city);
  const weatherImpactData = generateWeatherImpact(city);
  const areaCongestionData = generateAreaCongestion(city);
  const forecastData = generateForecast(city);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-secondary">Traffic Analytics</h1>
        <p className="text-sm text-cream/55">
          Deep insights into {city.name}'s traffic patterns, weather correlation, and forecasts.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Peak Hour Analysis */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-secondary">Peak Hour Analysis</h3>
          <p className="text-xs text-cream/45">Congestion intensity throughout the day</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHourData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={palette.grid} />
                <XAxis dataKey="hour" tick={chartAxisTickSm} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="congestion" radius={[6, 6, 0, 0]}>
                  {peakHourData.map((entry, idx) => (
                    <Cell key={idx} fill={congestionBarFill(entry.congestion)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather Impact */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-secondary">Weather Impact on Traffic</h3>
          <p className="text-xs text-cream/45">Average delay (min) and congestion increase (%) by weather</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherImpactData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={palette.grid} />
                <XAxis dataKey="weather" tick={chartAxisTickSm} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={55} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="avgDelay" name="Avg Delay (min)" fill={palette.bordo} radius={[6, 6, 0, 0]} />
                <Bar dataKey="congestionIncrease" name="Congestion Increase (%)" fill={palette.greenLight} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area-wise Congestion */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-secondary">Area-wise Congestion</h3>
          <p className="text-xs text-cream/45">Congestion percentage and incident counts by area</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaCongestionData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={palette.grid} />
                <XAxis type="number" tick={chartAxisTickSm} axisLine={false} tickLine={false} />
                <YAxis dataKey="area" type="category" width={90} tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="congestion" name="Congestion %" radius={[0, 6, 6, 0]}>
                  {areaCongestionData.map((entry, idx) => (
                    <Cell key={idx} fill={congestionBarFill(entry.congestion)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Trend Forecast */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-secondary">Weekly Traffic Forecast</h3>
          <p className="text-xs text-cream/45">Actual vs AI-forecasted congestion across the week</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.bordo} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={palette.bordo} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={palette.grid} />
                <XAxis dataKey="time" tick={chartAxisTick} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="congestion" name="Actual" stroke={palette.bordo} strokeWidth={2.5} fill="url(#forecastGrad)" />
                <Line type="monotone" dataKey="predicted" name="Forecast" stroke={palette.greenLight} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
