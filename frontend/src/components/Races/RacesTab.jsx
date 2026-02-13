import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi.js';
import RaceSelector from './RaceSelector.jsx';
import RaceResults from './RaceResults.jsx';
import TopThree from './TopThree.jsx';
import PositionLookup from './PositionLookup.jsx';
import RaceFacts from './RaceFacts.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import WeatherCard from '../common/WeatherCard.jsx';

const RACE_KEY = 'nascar-selected-race';

export default function RacesTab() {
  const [selectedRace, setSelectedRace] = useState(() => sessionStorage.getItem(RACE_KEY) || '');
  const [view, setView] = useState('results');
  const { data: races, loading: racesLoading, error: racesError } = useApi('/api/races');
  const { data: drivers } = useApi('/api/drivers');
  const { data: raceData, loading: raceLoading, error: raceError } = useApi(
    selectedRace ? `/api/races/${selectedRace}` : null,
    { enabled: !!selectedRace }
  );

  const handleSelectRace = (raceId) => {
    setSelectedRace(raceId);
    if (raceId) {
      sessionStorage.setItem(RACE_KEY, raceId);
    } else {
      sessionStorage.removeItem(RACE_KEY);
    }
  };

  // Auto-select the next upcoming race on load (only if no saved selection)
  useEffect(() => {
    if (!races?.length || selectedRace) return;
    const now = new Date();
    const upcoming = races.find(r => {
      if (r.winner_driver_id && r.winner_driver_id !== 0) return false;
      return new Date(r.date_scheduled) >= now;
    });
    if (upcoming) handleSelectRace(String(upcoming.race_id));
  }, [races]);

  // Extract results from weekend feed
  const results = (() => {
    if (!raceData) return [];
    // weekend-feed structure varies; try common paths
    const weekendRace = raceData.weekend_race || [];
    const race = weekendRace.find(r => String(r.race_id) === String(selectedRace)) || weekendRace[0];
    return race?.results || raceData.results || [];
  })();

  const selectedRaceObj = races?.find(r => String(r.race_id) === String(selectedRace));
  const trackId = selectedRaceObj?.track_id;
  const raceDate = selectedRaceObj?.date_scheduled?.split('T')[0];
  const isRaceDay = raceDate === new Date().toISOString().split('T')[0];

  if (racesLoading) return <LoadingSpinner />;
  if (racesError) return <ErrorMessage message={racesError} />;

  return (
    <div className="space-y-4">
      <RaceSelector races={races} selected={selectedRace} onSelect={handleSelectRace} />

      {selectedRace && (
        <>
          <WeatherCard key={selectedRace} trackId={trackId} raceDate={raceDate} mode={isRaceDay ? 'current' : 'forecast'} />

          <div className="flex gap-1 bg-nascar-surface rounded-lg p-1">
            {['results', 'top3', 'lookup'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
                  view === v
                    ? 'bg-nascar-card text-nascar-yellow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {v === 'results' ? 'Full Results' : v === 'top3' ? 'Top 3' : 'Lookup'}
              </button>
            ))}
          </div>

          {raceLoading ? (
            <LoadingSpinner />
          ) : raceError ? (
            <ErrorMessage message={raceError} />
          ) : (
            <>
              {view === 'results' && <RaceResults results={results} />}
              {view === 'top3' && <TopThree results={results} />}
              {view === 'lookup' && <PositionLookup results={results} drivers={drivers} />}
              <RaceFacts raceData={raceData} />
            </>
          )}
        </>
      )}

      {!selectedRace && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-4xl mb-3">🏆</p>
          <p>Select a race to view results</p>
        </div>
      )}
    </div>
  );
}
