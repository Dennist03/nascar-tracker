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

  // Parse selectedRace format: "seriesId-raceId"
  const [seriesId, raceId] = selectedRace ? selectedRace.split('-') : [null, null];

  const { data: raceData, loading: raceLoading, error: raceError } = useApi(
    selectedRace && seriesId && raceId ? `/api/races/${seriesId}/${raceId}` : null,
    { enabled: !!selectedRace && !!seriesId && !!raceId }
  );

  // Fetch live feed as fallback for recently completed races
  const { data: liveFeed } = useApi('/api/live/feed');

  const handleSelectRace = (raceKey) => {
    setSelectedRace(raceKey);
    if (raceKey) {
      sessionStorage.setItem(RACE_KEY, raceKey);
    } else {
      sessionStorage.removeItem(RACE_KEY);
    }
  };

  // Auto-select the next upcoming race (or most recent if no upcoming)
  useEffect(() => {
    if (!races?.length || selectedRace) return;
    const now = new Date();

    // Find next upcoming race (not yet completed)
    const upcoming = races.find(r => {
      const raceDate = new Date(r.race_date || r.date_scheduled);
      const isCompleted = r.winner_driver_id && r.winner_driver_id !== 0;
      return !isCompleted && raceDate >= now;
    });

    // If no upcoming race, select the most recent completed race
    const raceToSelect = upcoming || races[races.length - 1];

    if (raceToSelect) {
      handleSelectRace(`${raceToSelect.series_id}-${raceToSelect.race_id}`);
    }
  }, [races]);

  // Extract results from weekend feed OR live feed (fallback)
  const { results, usingLiveFeed } = (() => {
    if (!raceData) return { results: [], usingLiveFeed: false };

    // Try to get results from weekend feed
    const weekendRace = raceData.weekend_race || [];
    const race = weekendRace.find(r => String(r.race_id) === String(raceId)) || weekendRace[0];
    const weekendResults = race?.results || raceData.results || [];

    // Check if weekend results are valid (have finish positions)
    const hasValidResults = weekendResults.some(r =>
      r.finishing_position != null || r.finish_position != null
    );

    // If official results aren't ready, try live feed as fallback
    if (!hasValidResults && liveFeed && String(liveFeed.race_id) === String(raceId)) {
      // Convert live feed vehicles to results format
      const liveResults = (liveFeed.vehicles || [])
        .sort((a, b) => a.running_position - b.running_position)
        .map(v => ({
          finishing_position: v.running_position,
          finish_position: v.running_position,
          car_number: String(v.vehicle_number),
          driver_fullname: v.driver?.full_name,
          driver_full_name: v.driver?.full_name,
          driver_name: v.driver?.last_name,
          team_name: v.sponsor_name,
          sponsor_name: v.sponsor_name,
          laps_completed: v.laps_completed,
          finishing_status: v.status === 1 ? 'Running' : 'Out',
          status: v.status === 1 ? 'Running' : 'Out',
          starting_position: v.starting_position,
        }));
      return { results: liveResults, usingLiveFeed: true };
    }

    return { results: weekendResults, usingLiveFeed: false };
  })();

  const selectedRaceObj = races?.find(r =>
    String(r.series_id) === String(seriesId) && String(r.race_id) === String(raceId)
  );
  const trackId = selectedRaceObj?.track_id;
  const raceDate = (selectedRaceObj?.date_scheduled || selectedRaceObj?.race_date)?.split('T')[0];
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
              {usingLiveFeed && (
                <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-2 text-xs text-yellow-400">
                  ℹ️ Official results pending - showing live race finish order
                </div>
              )}
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
