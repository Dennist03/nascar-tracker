export default function RaceSelector({ races, selected, onSelect }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        const date = formatDate(r.date_scheduled);
        return (
          <option key={r.race_id} value={r.race_id}>
            {completed ? '\u2705 ' : ''}{date} - {r.race_name} ({r.track_name})
          </option>
        );
      })}
    </select>
  );
}
