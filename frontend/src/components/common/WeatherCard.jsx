import { useApi } from '../../hooks/useApi.js';

const severityStyles = {
  high: 'border-red-500/50 bg-red-500/10 text-red-300',
  medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
  low: 'border-green-500/50 bg-green-500/10 text-green-300',
};

function SkeletonPulse() {
  return (
    <div className="bg-nascar-card rounded-xl p-3 border border-nascar-surface animate-pulse">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-lg bg-nascar-surface" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-nascar-surface rounded w-24" />
          <div className="h-2 bg-nascar-surface rounded w-40" />
        </div>
      </div>
    </div>
  );
}

export default function WeatherCard({ trackId, raceDate, mode = 'current' }) {
  const params = new URLSearchParams({ track_id: trackId, mode });
  if (raceDate) params.set('date', raceDate);

  const { data, loading, error } = useApi(
    trackId ? `/api/weather?${params}` : null,
    { enabled: !!trackId }
  );

  if (!trackId) return null;
  if (loading) return <SkeletonPulse />;
  if (error || !data || data.unavailable) return null;

  const isForecast = mode === 'forecast';

  return (
    <div className="bg-nascar-card rounded-xl p-3 border border-nascar-surface">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{data.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            {isForecast ? (
              <span className="text-white font-bold text-lg">
                {data.tempHigh}° <span className="text-gray-400 font-normal text-sm">/ {data.tempLow}°</span>
              </span>
            ) : (
              <span className="text-white font-bold text-lg">{data.temp}°F</span>
            )}
            <span className="text-gray-400 text-xs">{data.description}</span>
          </div>
          <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
            {data.humidity != null && <span>💧 {data.humidity}%</span>}
            <span>💨 {data.windSpeed} mph</span>
            <span>🌧️ {data.rainChance}%</span>
          </div>
        </div>
      </div>

      {data.tips?.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {data.tips.map((tip, i) => (
            <div
              key={i}
              className={`text-xs px-2.5 py-1.5 rounded-lg border ${severityStyles[tip.severity] || severityStyles.low}`}
            >
              {tip.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
