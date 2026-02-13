export default function RaceResults({ results }) {
  if (!results?.length) {
    return <p className="text-gray-400 text-center py-4">No results available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-nascar-surface text-left">
            <th className="py-2 px-2 w-12">Pos</th>
            <th className="py-2 px-2 w-12">#</th>
            <th className="py-2 px-2">Driver</th>
            <th className="py-2 px-2 hidden sm:table-cell">Team</th>
            <th className="py-2 px-2 w-16">Laps</th>
            <th className="py-2 px-2 w-20">Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr
              key={i}
              className={`border-b border-nascar-surface/50 ${
                i < 3 ? 'text-nascar-yellow' : 'text-gray-200'
              }`}
            >
              <td className="py-2 px-2 font-bold">{r.finishing_position || r.position}</td>
              <td className="py-2 px-2">{r.car_number}</td>
              <td className="py-2 px-2 truncate max-w-[140px]">{r.driver_fullname || r.driver_name}</td>
              <td className="py-2 px-2 hidden sm:table-cell text-gray-400 truncate max-w-[120px]">{r.team_name || r.sponsor_name}</td>
              <td className="py-2 px-2">{r.laps_completed}</td>
              <td className="py-2 px-2 text-xs">
                <span className={r.finishing_status === 'Running' ? 'text-flag-green' : 'text-gray-400'}>
                  {r.finishing_status || r.status || '-'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
