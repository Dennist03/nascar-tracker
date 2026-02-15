export default function StageInfo({ data }) {
  if (!data?.stage) return null;

  const { stage } = data;
  const currentStage = stage.stage_num || 1;
  const vehicles = data.vehicles || [];

  // Calculate stage end laps (approximate if not provided)
  const totalLaps = data.laps_in_race || data.total_laps || 120;
  const stage1End = Math.floor(totalLaps / 4); // ~25% for stage 1
  const stage2End = Math.floor(totalLaps / 2); // ~50% for stage 2
  const stage3End = totalLaps; // 100% for final stage

  // Determine stage winners by looking at who led at stage end
  // Note: This is approximate until NASCAR CDN provides explicit stage winner data
  const getStageWinners = (stageEndLap, stageNum) => {
    if (data.lap_number < stageEndLap) {
      return { status: stageNum < currentStage ? 'completed' : stageNum === currentStage ? 'in_progress' : 'upcoming', winners: [] };
    }

    // For completed stages, show top 3 by laps led in that stage or current position
    const leaders = vehicles
      .filter(v => v.laps_led && Array.isArray(v.laps_led) && v.laps_led.length > 0)
      .map(v => {
        // Count laps led before stage end
        const lapsLedInStage = v.laps_led.filter(led =>
          led.start_lap <= stageEndLap && led.end_lap <= stageEndLap
        ).reduce((sum, led) => sum + (led.end_lap - led.start_lap + 1), 0);

        return {
          number: v.vehicle_number,
          name: v.driver?.full_name || v.driver?.last_name || '',
          lapsLed: lapsLedInStage,
          position: v.running_position
        };
      })
      .sort((a, b) => b.lapsLed - a.lapsLed)
      .slice(0, 3);

    // If no clear leaders data, use top 3 positions
    if (leaders.length === 0 || leaders[0].lapsLed === 0) {
      return {
        status: 'completed',
        winners: vehicles
          .sort((a, b) => a.running_position - b.running_position)
          .slice(0, 3)
          .map(v => ({
            number: v.vehicle_number,
            name: v.driver?.full_name || v.driver?.last_name || '',
            position: v.running_position
          }))
      };
    }

    return { status: 'completed', winners: leaders };
  };

  const stage1 = getStageWinners(stage1End, 1);
  const stage2 = getStageWinners(stage2End, 2);
  const stage3 = getStageWinners(stage3End, 3);

  const renderStageColumn = (stageNum, stageData, endLap) => {
    const isActive = currentStage === stageNum;
    const isCompleted = stageData.status === 'completed';
    const isUpcoming = stageData.status === 'upcoming';
    const isFinalStage = stageNum === 3;

    // For final stage, show actual race finish order (top 3)
    const displayData = isFinalStage && (isActive || isCompleted)
      ? vehicles.sort((a, b) => a.running_position - b.running_position).slice(0, 3).map(v => ({
          number: v.vehicle_number,
          name: v.driver?.full_name || v.driver?.last_name || '',
          position: v.running_position
        }))
      : stageData.winners;

    return (
      <div className={`flex-1 p-2 rounded-lg ${isActive ? 'bg-nascar-surface border border-nascar-yellow' : 'bg-nascar-surface/50'}`}>
        <div className="text-xs font-semibold mb-1 flex items-center justify-between">
          <span className={isActive ? 'text-nascar-yellow' : 'text-gray-400'}>
            {isFinalStage ? 'Final' : `Stage ${stageNum}`}
          </span>
          {isActive && <span className="text-nascar-yellow text-[10px]">●</span>}
          {isCompleted && !isFinalStage && <span className="text-green-500 text-[10px]">✓</span>}
          {isCompleted && isFinalStage && <span className="text-green-500 text-[10px]">🏁</span>}
        </div>

        {isUpcoming && (
          <div className="text-[10px] text-gray-500 py-2">{isFinalStage ? 'In Progress' : 'Not Started'}</div>
        )}

        {(isActive || isCompleted) && displayData.length > 0 && (
          <div className="space-y-0.5">
            {displayData.map((winner, idx) => (
              <div key={idx} className="text-[10px] flex items-center gap-1">
                <span className="text-gray-500">{idx + 1}.</span>
                <span className="text-nascar-yellow font-bold">#{winner.number}</span>
                <span className="text-gray-300 truncate">{winner.name?.split(' ').pop()}</span>
              </div>
            ))}
          </div>
        )}

        {(isActive || isCompleted) && displayData.length === 0 && (
          <div className="text-[10px] text-gray-500 py-2">Loading...</div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-nascar-card rounded-xl p-3 border border-nascar-surface">
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
        Stage Winners & Final Results
      </div>
      <div className="flex gap-2">
        {renderStageColumn(1, stage1, stage1End)}
        {renderStageColumn(2, stage2, stage2End)}
        {renderStageColumn(3, stage3, stage3End)}
      </div>
    </div>
  );
}
