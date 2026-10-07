import { useEffect, useState } from 'react';
import {
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineCloud,
  HiOutlineTruck,
  HiOutlineSparkles,
  HiOutlineChartSquareBar,
} from 'react-icons/hi';
import { HiOutlineArrowTrendingUp } from 'react-icons/hi2';
import { weatherOptions } from '../data/mockData';
import { generatePrediction } from '../data/predictionEngine';
import { useCity } from '../context/CityContext';
import type { PredictionOutput } from '../types';
import CongestionBadge from '../components/CongestionBadge';

export default function PredictionPage() {
  const { city } = useCity();
  const locations = city.zones.map((z) => z.name);

  const [location, setLocation] = useState(locations[0]);
  const [time, setTime] = useState('09:00');
  const [weather, setWeather] = useState(weatherOptions[0]);
  const [vehicleCount, setVehicleCount] = useState(3000);
  const [output, setOutput] = useState<PredictionOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocation(city.zones[0]?.name ?? '');
    setOutput(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city.id]);

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      const result = generatePrediction({ location, time, weather, vehicleCount }, city);
      setOutput(result);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 bg-primary/40 px-3 py-1 text-xs font-semibold text-cream">
          <HiOutlineSparkles className="h-3.5 w-3.5" />
          AI Traffic Prediction Engine
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
          Predict Traffic Conditions Anywhere in {city.name}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-cream/55">
          Enter a location, time, and conditions to generate a real-time AI-powered traffic forecast.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Input Form */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-secondary">Prediction Inputs</h3>
          <div className="mt-5 space-y-5">
            <div>
              <label className="label-text">
                <span className="inline-flex items-center gap-1.5"><HiOutlineLocationMarker className="h-3.5 w-3.5" /> Location</span>
              </label>
              <select
                className="input-field"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">
                <span className="inline-flex items-center gap-1.5"><HiOutlineClock className="h-3.5 w-3.5" /> Time</span>
              </label>
              <input
                type="time"
                className="input-field"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div>
              <label className="label-text">
                <span className="inline-flex items-center gap-1.5"><HiOutlineCloud className="h-3.5 w-3.5" /> Weather Condition</span>
              </label>
              <select
                className="input-field"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
              >
                {weatherOptions.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">
                <span className="inline-flex items-center gap-1.5"><HiOutlineTruck className="h-3.5 w-3.5" /> Vehicle Count (est.)</span>
              </label>
              <input
                type="range"
                min={500}
                max={8000}
                step={100}
                value={vehicleCount}
                onChange={(e) => setVehicleCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-cream/45">
                <span>500</span>
                <span className="font-semibold text-secondary">{vehicleCount.toLocaleString()} vehicles</span>
                <span>8,000</span>
              </div>
            </div>

            <button onClick={handlePredict} disabled={loading} className="btn-primary w-full">
              {loading ? 'Analyzing...' : 'Generate Prediction'}
              {!loading && <HiOutlineSparkles className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-3">
          {!output && !loading && (
            <div className="card flex h-full min-h-[420px] flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HiOutlineSparkles className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium text-secondary">No prediction yet</p>
              <p className="max-w-xs text-sm text-cream/45">
                Fill in the inputs and click &ldquo;Generate Prediction&rdquo; to see AI-powered traffic forecasts.
              </p>
            </div>
          )}

          {loading && (
            <div className="card flex h-full min-h-[420px] flex-col items-center justify-center gap-3 p-10">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <p className="text-sm text-cream/55">Running AI model on live inputs...</p>
            </div>
          )}

          {output && !loading && (
            <div className="animate-fade-in space-y-6">
              <div className="card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cream/45">Prediction for</p>
                    <h3 className="text-lg font-bold text-secondary">{location}, {city.name} &middot; {time}</h3>
                  </div>
                  <CongestionBadge level={output.congestionLevel} />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-green-100 p-4">
                    <div className="flex items-center gap-2 text-cream/45">
                      <HiOutlineChartSquareBar className="h-4 w-4" />
                      <span className="text-xs font-medium">Congestion Score</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-secondary">{output.congestionScore}%</p>
                  </div>
                  <div className="rounded-2xl bg-green-100 p-4">
                    <div className="flex items-center gap-2 text-cream/45">
                      <HiOutlineClock className="h-4 w-4" />
                      <span className="text-xs font-medium">Predicted Delay</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-secondary">{output.predictedDelay} min</p>
                  </div>
                  <div className="rounded-2xl bg-green-100 p-4">
                    <div className="flex items-center gap-2 text-cream/45">
                      <HiOutlineArrowTrendingUp className="h-4 w-4" />
                      <span className="text-xs font-medium">Average Speed</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-secondary">{output.avgSpeed} km/h</p>
                  </div>
                </div>
              </div>

              <div className="card border-l-4 border-l-primary p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HiOutlineSparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary">AI Recommendation</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-cream/70">{output.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
