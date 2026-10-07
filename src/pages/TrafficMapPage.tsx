import { useCallback, useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HiOutlineMapPin } from 'react-icons/hi2';
import type { CongestionLevel } from '../types';
import { useCity } from '../context/CityContext';
import CongestionBadge from '../components/CongestionBadge';
import { getTomTomFlowSegment, type TomTomFlowSegment } from '../services/tomtomTraffic';

type LatLngTuple = [number, number];

interface LiveReading {
  flow: TomTomFlowSegment;
  congestion: CongestionLevel;
  congestionScore: number;
}
type ZoneFetchResult =
  | { ok: true; name: string; reading: LiveReading }
  | { ok: false; name: string; error: string };


const apiKey = import.meta.env.VITE_TOMTOM_API_KEY?.trim() ?? '';
const congestionColor: Record<CongestionLevel, string> = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#ef4444',
};

function toLiveReading(flow: TomTomFlowSegment): LiveReading {
  const ratio = flow.currentSpeed / Math.max(flow.freeFlowSpeed, 1);
  const score = flow.roadClosure
    ? 100
    : Math.max(0, Math.min(100, Math.round((1 - ratio) * 100)));
  const congestion: CongestionLevel = flow.roadClosure || ratio < 0.35
    ? 'High'
    : ratio < 0.75
      ? 'Medium'
      : 'Low';
  return { flow, congestion, congestionScore: score };
}

function FitCityBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length) map.fitBounds(points, { padding: [36, 36], maxZoom: 13 });
  }, [map, points]);
  return null;
}

export default function TrafficMapPage() {
  const { city } = useCity();
  const [selectedName, setSelectedName] = useState('');
  const [readings, setReadings] = useState<Record<string, LiveReading>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [keyError, setKeyError] = useState('');

  const points = useMemo<LatLngTuple[]>(
    () => city.zones.map((zone) => [zone.lat, zone.lng] as LatLngTuple),
    [city],
  );
  const center: LatLngTuple = points[0] ?? [13.0827, 80.2707];
  const selected = city.zones.find((zone) => zone.name === selectedName) ?? city.zones[0];
  const keyParam = encodeURIComponent(apiKey);
  const baseTiles = `https://api.tomtom.com/map/1/tile/basic/night/{z}/{x}/{y}.png?key=${keyParam}`;
  const trafficTiles = `https://api.tomtom.com/traffic/map/4/tile/flow/relative0-dark/{z}/{x}/{y}.png?key=${keyParam}`;

  const refreshTraffic = useCallback(async () => {
    if (!apiKey) {
      setReadings({});
      setKeyError('Missing VITE_TOMTOM_API_KEY. Add it to .env.local locally and configure the GitHub Actions secret for the deployed site.');
      setLoading(false);
      return;
    }

    setKeyError('');
    setLoading(true);
    setReadings({});
    setErrors({});

    const results: ZoneFetchResult[] = await Promise.all(
  city.zones.map(async (zone): Promise<ZoneFetchResult> => {
    try {
      const flow = await getTomTomFlowSegment(zone.lat, zone.lng, apiKey);
      return {
        ok: true,
        name: zone.name,
        reading: toLiveReading(flow),
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Traffic request failed.';
      return {
        ok: false,
        name: zone.name,
        error: message,
      };
    }
  }),
);

const nextReadings: Record<string, LiveReading> = {};
const nextErrors: Record<string, string> = {};

for (const result of results) {
  if (result.ok) {
    nextReadings[result.name] = result.reading;
  } else {
    nextErrors[result.name] = result.error;
  }
}

    setReadings(nextReadings);
    setErrors(nextErrors);
    setUpdatedAt(new Date());
    setLoading(false);
  }, [city]);

  useEffect(() => {
    setSelectedName(city.zones[0]?.name ?? '');
    void refreshTraffic();
  }, [city, refreshTraffic]);

  const liveCount = Object.keys(readings).length;
  const selectedReading = selected ? readings[selected.name] : undefined;
  const selectedError = selected ? errors[selected.name] : undefined;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Live traffic layer</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-secondary">{city.name} Traffic Map</h1>
          <p className="mt-1 text-sm text-cream/65">TomTom road map and current traffic flow, with speed samples near the listed zones.</p>
        </div>
        <button
          type="button"
          onClick={() => void refreshTraffic()}
          disabled={loading}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? 'Updating…' : 'Refresh zone readings'}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-cream/15 bg-green-100/60 px-4 py-3 text-sm text-secondary">
        <span><strong>{liveCount}/{city.zones.length}</strong> zones with a live point reading</span>
        {updatedAt && <span>Last request: <strong>{updatedAt.toLocaleTimeString()}</strong></span>}
        <span className="text-xs text-cream/60">Map traffic tiles are provided by TomTom; refresh is manual to conserve free usage.</span>
      </div>
      {keyError && <p className="mt-3 rounded-lg border border-red-400/30 bg-red-950/30 p-3 text-sm text-red-200">{keyError}</p>}
      {!keyError && Object.keys(errors).length > 0 && (
        <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-950/20 p-3 text-sm text-amber-100">
          {Object.keys(errors).length} zone(s) had no usable road-segment response. Select a gray marker/card for details; no sample value is presented as live.
        </p>
      )}

      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-cream/10 bg-[#071511] p-3 shadow-2xl shadow-black/20 xl:col-span-2">
          <div className="relative overflow-hidden rounded-xl">
            <MapContainer
              key={city.id}
              center={center}
              zoom={12}
              scrollWheelZoom
              style={{ height: 'min(72vh, 680px)', minHeight: '460px', width: '100%', background: '#0b1515' }}
            >
              <TileLayer url={baseTiles} attribution="&copy; TomTom" maxZoom={20} />
              <TileLayer url={trafficTiles} opacity={0.88} attribution="Traffic &copy; TomTom" maxZoom={20} />
              <FitCityBounds points={points} />
              {city.zones.map((zone) => {
                const reading = readings[zone.name];
                const color = reading ? congestionColor[reading.congestion] : '#94a3b8';
                return (
                  <CircleMarker
                    key={zone.name}
                    center={[zone.lat, zone.lng]}
                    radius={reading?.congestion === 'High' ? 10 : 8}
                    pathOptions={{ color: '#f8fafc', weight: 2, fillColor: color, fillOpacity: 0.92 }}
                    eventHandlers={{ click: () => setSelectedName(zone.name) }}
                  >
                    <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
                      <span className="font-semibold">{zone.name}</span>
                      <span> · {reading ? `${reading.flow.currentSpeed} km/h` : loading ? 'loading' : 'no sample'}</span>
                    </Tooltip>
                    <Popup>
                      <strong>{zone.name}</strong><br />
                      {reading
                        ? `${reading.flow.currentSpeed} km/h now · ${reading.flow.freeFlowSpeed} km/h free flow`
                        : errors[zone.name] ?? 'No live point reading available.'}
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
            <div className="pointer-events-none absolute left-3 top-3 z-[1000] flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-slate-950/85 px-3 py-1.5 text-xs font-medium text-white shadow-lg">TomTom map</span>
              <span className="rounded-full border border-white/10 bg-slate-950/85 px-3 py-1.5 text-xs font-medium text-white shadow-lg">Live traffic flow</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-3 text-xs text-cream/60">
            <span className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Free-flowing</span>
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber-400" />Slowing</span>
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-red-500" />Congested</span>
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-slate-400" />No point sample</span>
            </span>
            <span>© TomTom · Leaflet</span>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="card p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><HiOutlineMapPin className="h-5 w-5" /></span>
              <div>
                <h2 className="text-base font-semibold text-secondary">{selected?.name ?? 'Choose a zone'}</h2>
                <p className="text-xs text-cream/55">{selected ? `${city.name} · ${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)}` : city.name}</p>
              </div>
            </div>

            {selectedReading ? (
              <>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-green-100 px-4 py-3">
                  <span className="text-sm text-cream/65">Speed-based traffic level</span>
                  <CongestionBadge level={selectedReading.congestion} />
                </div>
                <div className="mt-3 space-y-3">
                  <Metric label="Current road speed" value={`${selectedReading.flow.currentSpeed} km/h`} />
                  <Metric label="Free-flow speed" value={`${selectedReading.flow.freeFlowSpeed} km/h`} />
                  <Metric label="Relative congestion score" value={`${selectedReading.congestionScore}%`} />
                  <Metric label="Provider confidence" value={`${Math.round(selectedReading.flow.confidence * 100)}%`} />
                  <Metric label="Road closure reported" value={selectedReading.flow.roadClosure ? 'Yes' : 'No'} />
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-xl border border-cream/15 bg-green-100/60 p-4 text-sm text-secondary">
                {loading ? 'Waiting for TomTom traffic data…' : selectedError ?? keyError ?? 'No live road-segment reading for this point.'}
              </div>
            )}
          </section>

          <section className="card p-5">
            <h3 className="text-sm font-semibold text-secondary">Zone readings</h3>
            <div className="mt-3 space-y-2">
              {city.zones.map((zone) => {
                const reading = readings[zone.name];
                const color = reading ? congestionColor[reading.congestion] : '#94a3b8';
                return (
                  <button
                    key={zone.name}
                    type="button"
                    onClick={() => setSelectedName(zone.name)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition ${selected?.name === zone.name ? 'border-primary/50 bg-primary/10' : 'border-cream/10 hover:border-cream/25'}`}
                  >
                    <span className="flex items-center gap-2 text-secondary"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{zone.name}</span>
                    <span className="text-xs text-cream/65">{reading ? `${reading.flow.currentSpeed} km/h` : loading ? '…' : 'Unavailable'}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <p className="rounded-xl border border-cream/10 bg-black/10 p-4 text-xs leading-relaxed text-cream/60">
            The colored road overlay is TomTom traffic flow. Zone figures are provider speed samples near the saved coordinates; the level is calculated from current speed versus free-flow speed. Dashboard charts, prediction outputs, route examples, and analytics remain sample/demo data.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-cream/10 px-4 py-3">
      <span className="text-sm text-cream/65">{label}</span>
      <span className="text-sm font-semibold text-secondary">{value}</span>
    </div>
  );
}
