import { useApi } from '../../hooks/useApi.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

export default function DriverStats({ driver }) {
  const { data: standings, loading } = useApi('/api/standings');

  if (!driver) return null;
  if (loading) return <LoadingSpinner />;

  // Find driver in standings - try multiple matching strategies
  const allDrivers = standings || [];
  const driverStanding = allDrivers.find(s =>
    String(s.car_number) === String(driver.number) ||
    s.driver_id === driver.id ||
    (s.first_name === driver.firstName && s.last_name === driver.lastName)
  );

  const stats = [
    { label: 'Points Pos', value: driverStanding?.position || '-' },
    { label: 'Points', value: driverStanding?.points || '-' },
    { label: 'Wins', value: driverStanding?.wins || 0 },
    { label: 'Poles', value: driverStanding?.poles || 0 },
    { label: 'Top 5s', value: driverStanding?.top5 ?? driverStanding?.top_5 ?? 0 },
    { label: 'Top 10s', value: driverStanding?.top10 ?? driverStanding?.top_10 ?? 0 },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Season Stats
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {stats.map(s => (
          <div key={s.label} className="bg-nascar-card rounded-lg p-3 text-center border border-nascar-surface">
            <div className="text-xl font-bold text-nascar-yellow">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
