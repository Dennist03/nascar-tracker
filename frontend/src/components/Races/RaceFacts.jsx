export default function RaceFacts({ raceData }) {
  if (!raceData) return null;

  // Handle both live feed data and weekend feed data
  const race = raceData.weekend_race?.[0] || raceData;
  const isLiveFeed = !!raceData.vehicles; // Live feed has vehicles array

  // Helper to format time from seconds
  const formatTime = (seconds) => {
    if (!seconds) return null;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Get values with fallbacks for different data sources
  const leadChanges = race.number_of_lead_changes ?? race.lead_changes;
  const cautions = race.number_of_caution_segments ?? race.number_of_cautions;
  const cautionLaps = race.number_of_caution_laps ?? race.caution_laps;
  const leaders = race.number_of_leaders;
  const avgSpeed = race.average_speed;
  const marginOfVictory = race.margin_of_victory;
  const raceTime = race.total_race_time || (isLiveFeed && race.elapsed_time ? formatTime(race.elapsed_time) : null);

  const facts = [
    { label: 'Lead Changes', value: leadChanges ?? '-' },
    {
      label: 'Cautions',
      value: cautions != null
        ? (cautionLaps ? `${cautions} (${cautionLaps} laps)` : cautions)
        : '-'
    },
    { label: 'Different Leaders', value: leaders ?? '-' },
    { label: 'Avg Speed', value: avgSpeed ? `${parseFloat(avgSpeed).toFixed(1)} mph` : '-' },
    { label: 'Margin of Victory', value: marginOfVictory || '-' },
    { label: isLiveFeed ? 'Elapsed Time' : 'Race Time', value: raceTime || '-' },
  ];

  const hasFacts = facts.some(f => f.value !== '-');
  if (!hasFacts) return null;

  return (
    <div className="bg-nascar-card rounded-xl p-4 border border-nascar-surface mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 bg-nascar-yellow rounded-full" />
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Race Facts
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {facts.map(f => (
          <div key={f.label}>
            <div className="text-xs text-gray-400">{f.label}</div>
            <div className="text-sm font-semibold text-white mt-0.5">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
