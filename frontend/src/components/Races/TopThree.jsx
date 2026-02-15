const medals = ['🥇', '🥈', '🥉'];

export default function TopThree({ results }) {
  if (!results?.length) return null;

  // Sort by finish position before taking top 3
  const sortedResults = [...results].sort((a, b) => {
    const posA = a.finishing_position || a.finish_position || a.position || 999;
    const posB = b.finishing_position || b.finish_position || b.position || 999;
    return posA - posB;
  });

  const top = sortedResults.slice(0, 3);

  return (
    <div className="grid grid-cols-3 gap-2">
      {top.map((r, i) => (
        <div
          key={i}
          className={`bg-nascar-card rounded-xl p-3 text-center border ${
            i === 0 ? 'border-nascar-yellow' : 'border-nascar-surface'
          }`}
        >
          <div className="text-2xl mb-1">{medals[i]}</div>
          <div className="text-sm font-bold text-white truncate">
            {r.driver_fullname || r.driver_name}
          </div>
          <div className="text-nascar-yellow text-xs mt-1">#{r.car_number}</div>
          <div className="text-gray-400 text-xs mt-0.5 truncate">
            {r.team_name || r.sponsor_name}
          </div>
        </div>
      ))}
    </div>
  );
}
