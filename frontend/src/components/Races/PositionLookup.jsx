import { useState } from 'react';

export default function PositionLookup({ results, drivers }) {
  const [driverId, setDriverId] = useState('');

  const sorted = [...(drivers || [])].sort((a, b) =>
    (parseInt(a.number) || 999) - (parseInt(b.number) || 999)
  );

  const match = results?.find(r =>
    String(r.car_number) === String(sorted.find(d => String(d.id) === driverId)?.number)
  );

  return (
    <div className="bg-nascar-card rounded-xl p-4 border border-nascar-surface">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Position Lookup
      </h3>
      <select
        value={driverId}
        onChange={e => setDriverId(e.target.value)}
        className="w-full bg-nascar-surface border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-nascar-yellow mb-3"
      >
        <option value="">Pick a driver...</option>
        {sorted.map(d => (
          <option key={d.id} value={d.id}>
            #{d.number} - {d.fullName}
          </option>
        ))}
      </select>

      {driverId && results && (
        match ? (
          <div className="text-center py-3">
            <div className="text-3xl font-bold text-nascar-yellow">
              P{match.finishing_position || match.position}
            </div>
            <div className="text-sm text-gray-300 mt-1">
              {match.driver_fullname || match.driver_name}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {match.laps_completed} laps - {match.status || 'Finished'}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-3">Driver not found in results</p>
        )
      )}
    </div>
  );
}
