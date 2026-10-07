import { useEffect, useState } from 'react';
import { HiOutlineMapPin } from 'react-icons/hi2';
import { useCity } from '../context/CityContext';
import { computeZoneLayout } from '../utils/cityMapLayout';
import CongestionBadge from '../components/CongestionBadge';
import type { CongestionLevel } from '../types';
import { congestionLevelColors, palette } from '../theme/palette';

const congestionColor: Record<string, string> = { ...congestionLevelColors };

interface DisplayZone {
  name: string;
  area: string;
  congestion: CongestionLevel;
  congestionScore: number;
  avgSpeed: number;
  vehicleCount: number;
  lat: number;
  lng: number;
  x: number;
  y: number;
}

export default function TrafficMapPage() {
  const { city } = useCity();

  const zones: DisplayZone[] = city.zones.map((z, idx) => {
    const layout = computeZoneLayout(city.zones.length)[idx];
    return {
      name: z.name,
      area: `${z.name}, ${city.name}`,
      congestion: z.congestion,
      congestionScore: z.score,
      avgSpeed: z.speed,
      vehicleCount: z.vehicles,
      lat: z.lat,
      lng: z.lng,
      x: layout.x,
      y: layout.y,
    };
  });

  const [selected, setSelected] = useState<DisplayZone>(zones[0]);

  useEffect(() => {
    setSelected(zones[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city.id]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-secondary">{city.name} Traffic Map</h1>
        <p className="text-sm text-cream/55">
          Live congestion visualization across major {city.name} traffic zones.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-secondary">Live Zone Map</h3>
            <div className="flex items-center gap-4 text-xs text-cream/55">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Low</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" />Medium</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger" />High</span>
            </div>
          </div>

          <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-primary/30">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {/* Stylized road network */}
              <path d="M 0 40 L 100 55" stroke="#1A6B65" strokeWidth="0.8" fill="none" />
              <path d="M 20 0 L 40 100" stroke="#1A6B65" strokeWidth="0.8" fill="none" />
              <path d="M 60 0 L 55 100" stroke="#1A6B65" strokeWidth="0.8" fill="none" />
              <path d="M 0 70 L 100 78" stroke="#1A6B65" strokeWidth="0.8" fill="none" />
              <path d="M 10 20 L 70 85" stroke="#0F3D3A" strokeWidth="0.6" fill="none" strokeDasharray="1,1.5" />
              <path d="M 0 55 Q 50 45 100 82" stroke="#6C151E" strokeWidth="1" fill="none" />

              {zones.map((zone) => (
                <g key={zone.name}>
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={zone.congestion === 'High' ? 4.5 : 3.5}
                    fill={congestionColor[zone.congestion]}
                    opacity={0.25}
                    className={zone.congestion === 'High' ? 'animate-pulse-slow' : ''}
                  />
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={2.2}
                    fill={congestionColor[zone.congestion]}
                    stroke={palette.cream}
                    strokeWidth="0.6"
                    className="cursor-pointer transition-all"
                    onClick={() => setSelected(zone)}
                  />
                  <text
                    x={zone.x}
                    y={zone.y - 5}
                    fontSize="3.1"
                    fontWeight={selected.name === zone.name ? 700 : 500}
                    fill={palette.cream}
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {zone.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {zones.map((zone) => (
              <button
                key={zone.name}
                onClick={() => setSelected(zone)}
                className={`rounded-xl border px-3 py-2 text-left text-xs transition-all ${
                  selected.name === zone.name
                    ? 'border-primary bg-primary/30'
                    : 'border-cream/15 bg-green-100 hover:border-cream/30'
                }`}
              >
                <p className="font-semibold text-secondary">{zone.name}</p>
                <span className="mt-0.5 flex items-center gap-1 text-cream/45">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: congestionColor[zone.congestion] }} />
                  {zone.congestion}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Zone Detail Panel */}
        <div className="card p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HiOutlineMapPin className="h-4.5 w-4.5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-secondary">{selected.name}</h3>
              <p className="text-xs text-cream/45">{selected.area}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-green-100 px-4 py-3">
            <span className="text-sm text-cream/55">Congestion Level</span>
            <CongestionBadge level={selected.congestion} />
          </div>

          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-cream/10 px-4 py-3">
              <span className="text-sm text-cream/55">Congestion Score</span>
              <span className="text-sm font-semibold text-secondary">{selected.congestionScore}%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-cream/10 px-4 py-3">
              <span className="text-sm text-cream/55">Average Speed</span>
              <span className="text-sm font-semibold text-secondary">{selected.avgSpeed} km/h</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-cream/10 px-4 py-3">
              <span className="text-sm text-cream/55">Vehicle Count</span>
              <span className="text-sm font-semibold text-secondary">{selected.vehicleCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-cream/10 px-4 py-3">
              <span className="text-sm text-cream/55">Coordinates</span>
              <span className="text-xs font-mono text-cream/55">{selected.lat.toFixed(3)}, {selected.lng.toFixed(3)}</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-primary/20 p-4 text-xs leading-relaxed text-cream/70">
            {selected.congestion === 'High' &&
              `${selected.name} is currently experiencing heavy congestion. Consider alternate routes during this period.`}
            {selected.congestion === 'Medium' &&
              `${selected.name} has moderate traffic flow. Minor delays are expected.`}
            {selected.congestion === 'Low' &&
              `${selected.name} is flowing smoothly with minimal congestion right now.`}
          </div>
        </div>
      </div>
    </div>
  );
}
