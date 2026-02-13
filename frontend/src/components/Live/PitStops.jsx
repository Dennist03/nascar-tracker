export default function PitStops({ pitData }) {
  if (!pitData?.length) return null;

  // Show most recent pit stops first, limit to 10
  const recent = [...pitData]
    .sort((a, b) => (b.lap_count || 0) - (a.lap_count || 0))
    .slice(0, 10);

  return (
    <div className="bg-nascar-card rounded-xl p-4 border border-nascar-surface">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 bg-nascar-red rounded-full" />
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Recent Pit Stops
        </h3>
      </div>
      <div className="space-y-1.5">
        {recent.map((p, i) => {
          const gain = p.positions_gained_lost || 0;
          return (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
              <span className="text-nascar-yellow font-bold w-8">#{p.car_number || p.vehicle_number}</span>
              <span className="flex-1 truncate">{p.driver_name || `Car #${p.car_number}`}</span>
              {p.tire_change && (
                <span className="text-gray-500">{p.tire_change}</span>
              )}
              <span className="text-gray-500">Lap {p.lap_count || '-'}</span>
              {gain !== 0 && (
                <span className={gain > 0 ? 'text-flag-green' : 'text-flag-red'}>
                  {gain > 0 ? `+${gain}` : gain}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
