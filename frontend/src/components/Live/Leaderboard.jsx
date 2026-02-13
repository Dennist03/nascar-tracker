export default function Leaderboard({ vehicles, pitData }) {
  if (!vehicles?.length) {
    return <p className="text-gray-400 text-center py-4">No live data available</p>;
  }

  // Build pit stop count map from pit data
  const pitCounts = {};
  if (pitData?.length) {
    pitData.forEach(p => {
      const num = String(p.car_number || p.vehicle_number);
      pitCounts[num] = (pitCounts[num] || 0) + 1;
    });
  }

  const sorted = [...vehicles].sort(
    (a, b) => (a.running_position || 999) - (b.running_position || 999)
  );

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[2rem_2rem_1fr_3rem_2.5rem] sm:grid-cols-[2rem_2.5rem_1fr_5rem_3rem_2.5rem] gap-1 px-2 py-1 text-xs text-gray-400 uppercase">
        <span>Pos</span>
        <span>#</span>
        <span>Driver</span>
        <span className="hidden sm:block">Delta</span>
        <span className="text-center">Pits</span>
        <span></span>
      </div>

      {sorted.map(v => {
        const delta = (v.delta || v.diff || 0);
        const posChange = v.position_change || 0;
        const carNum = String(v.vehicle_number || v.car_number);

        return (
          <div
            key={carNum}
            className="grid grid-cols-[2rem_2rem_1fr_3rem_2.5rem] sm:grid-cols-[2rem_2.5rem_1fr_5rem_3rem_2.5rem] gap-1 px-2 py-1.5 bg-nascar-card rounded border border-nascar-surface/50 text-sm items-center"
          >
            <span className={`font-bold ${v.running_position <= 3 ? 'text-nascar-yellow' : 'text-gray-200'}`}>
              {v.running_position}
            </span>
            <span className="text-gray-400 text-xs">{carNum}</span>
            <span className="text-white truncate text-xs sm:text-sm">
              {v.driver?.full_name || v.driver_name || `#${carNum}`}
            </span>
            <span className="hidden sm:block text-xs text-gray-400">
              {v.running_position === 1 ? 'Leader' : (delta ? `+${delta}` : '-')}
            </span>
            <span className="text-center text-xs text-gray-400">
              {pitCounts[carNum] || 0}
            </span>
            <span className="text-right text-xs">
              {posChange > 0 && <span className="text-flag-green">&#9650;{posChange}</span>}
              {posChange < 0 && <span className="text-flag-red">&#9660;{Math.abs(posChange)}</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
