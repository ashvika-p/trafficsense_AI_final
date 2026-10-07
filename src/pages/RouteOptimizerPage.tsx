import { useEffect, useState } from 'react';
import {
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import { HiOutlineMapPin, HiOutlineTruck } from 'react-icons/hi2';
import { useCity } from '../context/CityContext';
import CongestionBadge from '../components/CongestionBadge';
import type { RouteSeed } from '../types';

function RouteCard({ route, isBest }: { route: RouteSeed; isBest: boolean }) {
  return (
    <div className={`card p-5 ${isBest ? 'border-2 border-primary/40' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          {isBest && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <HiOutlineCheckCircle className="h-3.5 w-3.5" /> Best Route
            </span>
          )}
          <h4 className="text-sm font-semibold text-secondary">{route.name}</h4>
        </div>
        <CongestionBadge level={route.congestion} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-cream/45">Distance</p>
          <p className="text-sm font-semibold text-secondary">{route.distance} km</p>
        </div>
        <div>
          <p className="text-xs text-cream/45">Travel Time</p>
          <p className="text-sm font-semibold text-secondary">{route.time} min</p>
        </div>
        <div>
          <p className="text-xs text-cream/45">Traffic Score</p>
          <p className="text-sm font-semibold text-secondary">{route.trafficScore}/100</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-cream/45">Via</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {route.via.map((v) => (
            <span key={v} className="rounded-full bg-green-100 px-2.5 py-1 text-xs text-cream/80">
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RouteOptimizerPage() {
  const { city } = useCity();
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    setSelectedIdx(0);
  }, [city.id]);

  const pair = city.routes[selectedIdx] ?? city.routes[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-secondary">Smart Route Optimizer</h1>
        <p className="text-sm text-cream/55">
          AI-recommended routes across {city.name}, ranked by live traffic conditions.
        </p>
      </div>

      {/* Route selector */}
      <div className="mt-7 card p-6">
        <div className="flex flex-wrap items-center gap-3">
          {city.routes.map((r, idx) => (
            <button
              key={`${r.from}-${r.to}`}
              onClick={() => setSelectedIdx(idx)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                selectedIdx === idx
                  ? 'border-primary bg-primary/30 text-cream'
                  : 'border-cream/15 text-cream/70 hover:border-cream/30'
              }`}
            >
              <HiOutlineMapPin className="h-4 w-4" />
              {r.from}
              <HiOutlineArrowRight className="h-3.5 w-3.5 text-cream/45" />
              {r.to}
            </button>
          ))}
        </div>
      </div>

      {/* Route Summary */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green text-cream">
              <HiOutlineTruck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-cream/45">Route</p>
              <p className="text-sm font-semibold text-secondary">{pair.from} &rarr; {pair.to}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-cream/55">
                <HiOutlineClock className="h-4 w-4" /> Fastest Time
              </span>
              <span className="text-sm font-semibold text-success">{pair.best.time} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-cream/55">
                <HiOutlineChartBar className="h-4 w-4" /> Best Traffic Score
              </span>
              <span className="text-sm font-semibold text-secondary">{pair.best.trafficScore}/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-cream/55">
                <HiOutlineMapPin className="h-4 w-4" /> Distance
              </span>
              <span className="text-sm font-semibold text-secondary">{pair.best.distance} km</span>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-primary/20 p-4 text-xs leading-relaxed text-cream/70">
            Choosing the <strong>{pair.best.name}</strong> saves approximately{' '}
            <strong>{Math.max(1, pair.alternative.time - pair.best.time)} minutes</strong> compared
            to the alternative route, based on current AI traffic modeling.
          </div>
        </div>

        {/* Route Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
          <RouteCard route={pair.best} isBest />
          <RouteCard route={pair.alternative} isBest={false} />
        </div>
      </div>
    </div>
  );
}
