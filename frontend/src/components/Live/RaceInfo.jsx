export default function RaceInfo({ data }) {
  if (!data) return null;

  // Map series_id to series name and styling
  const getSeriesInfo = (seriesId) => {
    switch (seriesId) {
      case 1:
        return { name: 'Cup Series', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
      case 2:
        return { name: 'Xfinity Series', color: 'bg-green-500', textColor: 'text-green-500' };
      case 3:
        return { name: 'Truck Series', color: 'bg-blue-500', textColor: 'text-blue-500' };
      default:
        return { name: 'NASCAR', color: 'bg-gray-500', textColor: 'text-gray-500' };
    }
  };

  const seriesInfo = getSeriesInfo(data.series_id);

  // Get run type label
  const getRunTypeLabel = (runType) => {
    switch (runType) {
      case 1: return 'Practice';
      case 2: return 'Qualifying';
      case 3: return 'Race';
      default: return null;
    }
  };

  const runTypeLabel = getRunTypeLabel(data.run_type);
  const totalLaps = data.laps_in_race || data.total_laps;

  // Detect if race is complete or finishing
  // flag_state: 1=green, 2=yellow, 8=checkered (common), 9=no race
  const isRaceFinished = data.flag_state === 8 ||
    (data.lap_number >= totalLaps && totalLaps > 0) ||
    (data.flag_state === 2 && data.lap_number >= totalLaps - 5); // Yellow at end likely means finish under caution

  return (
    <div className="bg-nascar-card rounded-xl p-3 border border-nascar-surface">
      {/* Series Badge and Race Title */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${seriesInfo.color} text-white`}>
          {seriesInfo.name}
        </span>
        {runTypeLabel && runTypeLabel !== 'Race' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-600 text-white">
            {runTypeLabel}
          </span>
        )}
        {isRaceFinished && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-600 text-white animate-pulse">
            🏁 FINAL
          </span>
        )}
      </div>

      {/* Race Name (run_name) - Main Title */}
      {data.run_name && (
        <div className="text-white font-bold text-lg mb-1">
          {data.run_name}
        </div>
      )}

      {/* Track Name */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {data.track_name && (
          <span className="text-gray-300 font-medium">{data.track_name}</span>
        )}
      </div>

      {/* Race Stats */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400">
        {data.lap_number != null && totalLaps != null && (
          <span>
            {isRaceFinished ? (
              <>
                <span className="text-white font-bold">Final</span>
                {' - '}{data.lap_number}{' / '}{totalLaps} laps
              </>
            ) : (
              <>
                Lap <span className="text-nascar-yellow font-bold">{data.lap_number}</span>
                {' / '}{totalLaps}
              </>
            )}
          </span>
        )}
        {data.number_of_caution_segments != null && (
          <span>Cautions: {data.number_of_caution_segments}</span>
        )}
        {data.number_of_lead_changes != null && (
          <span>Lead Changes: {data.number_of_lead_changes}</span>
        )}
      </div>
    </div>
  );
}
