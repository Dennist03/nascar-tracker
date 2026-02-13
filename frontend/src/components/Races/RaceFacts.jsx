export default function RaceFacts({ raceData }) {
  if (!raceData) return null;

  // Extract facts from weekend feed data
  const race = raceData.weekend_race?.[0] || raceData;
  const results = race.results || [];

  const facts = [
    { label: 'Lead Changes', value: race.lead_changes ?? race.number_of_lead_changes ?? '-' },
    { label: 'Cautions', value: race.number_of_cautions != null ? `${race.number_of_cautions} (${race.caution_laps ?? 0} laps)` : '-' },
    { label: 'Avg Speed', value: race.average_speed ? `${parseFloat(race.average_speed).toFixed(1)} mph` : '-' },
    { label: 'Margin of Victory', value: race.margin_of_victory || '-' },
    { label: 'Race Time', value: race.total_race_time || '-' },
    { label: 'Green Flag Passes', value: race.green_flag_passes_for_lead ?? race.green_flag_passes ?? '-' },
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
