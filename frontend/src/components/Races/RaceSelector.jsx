export default function RaceSelector({ races, selected, onSelect }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSeriesBadge = (seriesId) => {
    switch (seriesId) {
      case 1: return '🏆';  // Cup
      case 2: return '🟢';  // Xfinity
      case 3: return '🔵';  // Truck
      default: return '';
    }
  };

  return (
    <select
      value={selected || ''}
      onChange={e => onSelect(e.target.value)}
      className="w-full bg-nascar-surface border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nascar-yellow"
    >
      <option value="">Select a race...</option>
      {(races || []).map(r => {
        const completed = r.winner_driver_id && r.winner_driver_id !== 0;
        const date = formatDate(r.date_scheduled || r.race_date);
        const seriesBadge = getSeriesBadge(r.series_id);
        const seriesShort = r.series_short || '';

        // Show [FINAL] for completed races
        const status = completed ? '[FINAL] ' : '';

        return (
          <option key={`${r.series_id}-${r.race_id}`} value={`${r.series_id}-${r.race_id}`}>
            {status}{seriesBadge} {seriesShort} | {date} - {r.race_name}
          </option>
        );
      })}
    </select>
  );
}
