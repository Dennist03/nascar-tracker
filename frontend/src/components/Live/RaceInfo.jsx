export default function RaceInfo({ data }) {
  if (!data) return null;

  return (
    <div className="bg-nascar-card rounded-xl p-3 border border-nascar-surface">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {data.track_name && (
          <span className="text-white font-medium">{data.track_name}</span>
        )}
        {data.race_name && (
          <span className="text-gray-400">{data.race_name}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400">
        {data.lap_number != null && data.total_laps != null && (
          <span>
            Lap <span className="text-nascar-yellow font-bold">{data.lap_number}</span>
            {' / '}{data.total_laps}
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
