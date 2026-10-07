import { Link } from 'react-router-dom';
import {
  HiOutlineChartBar,
  HiOutlineMap,
  HiOutlineLightningBolt,
  HiOutlineChip,
  HiOutlineArrowRight,
  HiOutlineSparkles,
} from 'react-icons/hi';
import { HiOutlineSignal, HiOutlineTruck, HiOutlineGlobeAsiaAustralia } from 'react-icons/hi2';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from 'recharts';
import { useCity } from '../context/CityContext';
import { generateTrend } from '../data/chartGenerators';
import CongestionBadge from '../components/CongestionBadge';
import { palette } from '../theme/palette';

const features = [
  {
    icon: HiOutlineChip,
    title: 'AI-Powered Predictions',
    desc: 'Machine learning models trained on historical Indian traffic patterns forecast congestion before it happens.',
  },
  {
    icon: HiOutlineMap,
    title: 'Live Traffic Maps',
    desc: 'Visualize real-time congestion across major corridors in 20+ Indian cities, from T Nagar to Whitefield.',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Smart Route Optimizer',
    desc: 'Get the fastest route between any two points in the city with alternatives ranked by live traffic scoring.',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Deep Analytics',
    desc: 'Peak-hour breakdowns, weather-impact modeling, and area-wise congestion trends for city planners.',
  },
];

const stats = [
  { label: 'Cities Covered', value: '20+' },
  { label: 'Traffic Zones Monitored', value: '120+' },
  { label: 'Predictions Generated Daily', value: '48K' },
  { label: 'Average AI Accuracy', value: '92.6%' },
];

export default function LandingPage() {
  const { city, allCities, setCityId } = useCity();
  const trendData = generateTrend(city);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 via-green-100 to-bg">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(15,61,58,0.55),transparent_55%)]" />
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div className="animate-slide-up">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 bg-primary/40 px-3 py-1 text-xs font-semibold text-cream">
                <HiOutlineGlobeAsiaAustralia className="h-3.5 w-3.5" />
                Pan-India Smart City Initiative
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-secondary sm:text-5xl lg:text-6xl">
                Predict India's traffic<span className="text-primary">.</span>
                <br />
                Before it happens.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-secondary/75">
                TrafficSense AI is a smart traffic intelligence platform that forecasts
                congestion, optimizes routes, and gives city planners real-time visibility
                across 20+ major Indian cities &mdash; currently viewing <strong>{city.name}</strong>.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/dashboard" className="btn-primary text-base px-6 py-3">
                  Explore Dashboard
                  <HiOutlineArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/prediction" className="btn-secondary text-base px-6 py-3">
                  Try Live Prediction
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-secondary">{s.value}</p>
                    <p className="mt-1 text-xs leading-tight text-secondary/55">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live traffic analytics preview */}
            <div className="animate-fade-in">
              <div className="card p-5 shadow-card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-secondary">Live Congestion &mdash; {city.name}</p>
                    <p className="text-xs text-secondary/45">Updated moments ago</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                    Live
                  </span>
                </div>

                <div className="mt-4 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={palette.bordo} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={palette.bordo} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: `1px solid ${palette.tooltipBorder}`, fontSize: 12 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="congestion"
                        stroke={palette.bordo}
                        strokeWidth={2.5}
                        fill="url(#heroGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 space-y-2.5">
                  {city.zones.slice(0, 4).map((zone) => (
                    <div key={zone.name} className="flex items-center justify-between rounded-xl bg-green-100 px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-cream shadow-sm">
                          <HiOutlineTruck className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-secondary">{zone.name}</p>
                          <p className="text-xs text-secondary/45">{zone.speed} km/h avg</p>
                        </div>
                      </div>
                      <CongestionBadge level={zone.congestion} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Covered Strip */}
      <section className="border-y border-cream/10 bg-green py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-secondary/50">
            Live coverage across 20 major Indian cities
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {allCities.map((c) => (
              <button
                key={c.id}
                onClick={() => setCityId(c.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  c.id === city.id
                    ? 'border-cream bg-primary text-cream'
                    : 'border-cream/20 text-cream/70 hover:border-cream/40 hover:text-cream'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">Platform Features</span>
          <h2 className="section-heading mt-3">Everything a smart city needs to manage traffic</h2>
          <p className="mt-4 text-secondary/70">
            Built with modern AI and real-time visualization to keep Indian cities moving.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card card-hover p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/25 text-cream">
                <f.icon className="h-5.5 w-5.5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-secondary">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-green px-8 py-16 text-center sm:px-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(108,21,30,0.55),transparent_60%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,218,191,0.08),transparent_60%)]" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 bg-cream/10 px-3 py-1 text-xs font-semibold text-cream">
            <HiOutlineSignal className="h-3.5 w-3.5" />
            Ready when you are
          </span>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            Start predicting traffic in seconds &mdash; anywhere in India
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            Jump into the dashboard, run a live prediction, or explore optimized routes across
            any of our 20+ supported cities &mdash; no signup required.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link to="/dashboard" className="btn-primary text-base px-6 py-3">
              Get Started
              <HiOutlineArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cream/30 px-6 py-3 text-base font-semibold text-cream transition-colors hover:bg-cream/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
