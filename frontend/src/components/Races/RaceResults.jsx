export default function RaceResults({ results }) {
  if (!results?.length) {
    return <p className="text-gray-400 text-center py-4">No results available</p>;
  }

  // Determine if this is an upcoming race (no finish positions) or completed race
  const isUpcoming = !results[0]?.finishing_position && !results[0]?.finish_position;

  // Sort results appropriately
  const sortedResults = [...results].sort((a, b) => {
    if (isUpcoming) {
      // For upcoming races, sort by starting position (qualifying order)
      return (a.starting_position || 999) - (b.starting_position || 999);
    } else {
      // For completed races, sort by finish position
      const posA = a.finishing_position || a.finish_position || 999;
      const posB = b.finishing_position || b.finish_position || 999;
      return posA - posB;
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-nascar-surface text-left">
            <th className="py-2 px-2 w-12">{isUpcoming ? 'Start' : 'Pos'}</th>
            <th className="py-2 px-2 w-12">#</th>
            <th className="py-2 px-2">Driver</th>
            <th className="py-2 px-2 hidden sm:table-cell">Team</th>
            <th className="py-2 px-2 w-16">{isUpcoming ? '-' : 'Laps'}</th>
            <th className="py-2 px-2 w-20">{isUpcoming ? 'Qualified' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((r, i) => {
            const position = isUpcoming ? r.starting_position : (r.finishing_position || r.finish_position || r.position);

            return (
              <tr
                key={i}
                className={`border-b border-nascar-surface/50 ${
                  !isUpcoming && i < 3 ? 'text-nascar-yellow' : 'text-gray-200'
                }`}
              >
                <td className="py-2 px-2 font-bold">{position || '-'}</td>
                <td className="py-2 px-2">{r.car_number}</td>
                <td className="py-2 px-2 truncate max-w-[140px]">{r.driver_fullname || r.driver_full_name || r.driver_name || '-'}</td>
                <td className="py-2 px-2 hidden sm:table-cell text-gray-400 truncate max-w-[120px]">{r.team_name || r.sponsor_name || '-'}</td>
                <td className="py-2 px-2">{isUpcoming ? '-' : (r.laps_completed || '-')}</td>
                <td className="py-2 px-2 text-xs">
                  {isUpcoming ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className={r.finishing_status === 'Running' ? 'text-flag-green' : 'text-gray-400'}>
                      {r.finishing_status || r.status || '-'}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
