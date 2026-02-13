import { usePolling } from '../../hooks/usePolling.js';
import FlagStatus from './FlagStatus.jsx';
import RaceInfo from './RaceInfo.jsx';
import StageInfo from './StageInfo.jsx';
import Leaderboard from './Leaderboard.jsx';
import PitStops from './PitStops.jsx';
import RaceFacts from '../Races/RaceFacts.jsx';
import WeatherCard from '../common/WeatherCard.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';

export default function LiveTab() {
  const { data: feed, loading, error } = usePolling('/api/live/feed', {
    activeInterval: 10000,
    inactiveInterval: 60000,
  });

  const { data: pitData } = usePolling('/api/live/pit-data', {
    activeInterval: 10000,
    inactiveInterval: 120000,
  });

  if (loading && !feed) return <LoadingSpinner />;
  if (error && !feed) return <ErrorMessage message={error} />;

  const flagState = feed?.flag_state ?? 9;
  const vehicles = feed?.vehicles || [];
  const pits = pitData?.pit_stops || pitData || [];

  return (
    <div className="space-y-3">
      <FlagStatus flagState={flagState} />
      <RaceInfo data={feed} />
      <WeatherCard trackId={feed?.track_id} mode="current" />
      {feed?.stage && <StageInfo data={feed} />}
      <Leaderboard vehicles={vehicles} pitData={Array.isArray(pits) ? pits : []} />
      <PitStops pitData={Array.isArray(pits) ? pits : []} />
      <RaceFacts raceData={feed} />
    </div>
  );
}
