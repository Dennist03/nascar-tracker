import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi.js';
import DriverSelector from './DriverSelector.jsx';
import DriverCard from './DriverCard.jsx';
import DriverStats from './DriverStats.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';

const STORAGE_KEY = 'nascar-my-driver';

export default function MyDriverTab() {
  const { data: drivers, loading, error, refetch } = useApi('/api/drivers');
  const [selected, setSelected] = useState(null);

  // Load saved driver from localStorage once drivers load
  useEffect(() => {
    if (!drivers?.length) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = drivers.find(d => d.id === parsed.id);
        if (found) setSelected(found);
      } catch {}
    }
  }, [drivers]);

  const handleSelect = (driver) => {
    setSelected(driver);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: driver.id }));
  };

  if (loading && !drivers) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <DriverSelector drivers={drivers} selected={selected} onSelect={handleSelect} />

      {selected ? (
        <>
          <DriverCard driver={selected} />
          <DriverStats driver={selected} />
        </>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p className="text-4xl mb-3">🏎️</p>
          <p>Select a driver to see their stats</p>
        </div>
      )}
    </div>
  );
}
