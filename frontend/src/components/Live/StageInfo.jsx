export default function StageInfo({ data }) {
  if (!data?.stage) return null;

  const { stage } = data;
  const currentStage = stage.stage_num || 1;
  const totalStages = 3;
  const lapNumber = data.lap_number || 0;
  const totalLaps = data.total_laps || 1;

  // Stage laps from stage data if available
  const stageLaps = stage.laps_in_stage || Math.ceil(totalLaps / 3);
  const stageProgress = stageLaps > 0
    ? Math.min(100, ((stage.laps_completed || 0) / stageLaps) * 100)
    : (lapNumber / totalLaps) * 100;

  return (
    <div className="bg-nascar-card rounded-xl p-3 border border-nascar-surface">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          Stage {currentStage} of {totalStages}
        </span>
        <span className="text-xs text-nascar-yellow font-medium">
          {Math.round(stageProgress)}%
        </span>
      </div>
      <div className="h-2 bg-nascar-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-nascar-yellow rounded-full transition-all duration-500"
          style={{ width: `${stageProgress}%` }}
        />
      </div>
    </div>
  );
}
