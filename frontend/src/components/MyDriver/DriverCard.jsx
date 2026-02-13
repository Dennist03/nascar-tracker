export default function DriverCard({ driver }) {
  if (!driver) return null;

  return (
    <div className="bg-nascar-card rounded-xl p-4 flex items-center gap-4 border border-nascar-surface">
      <div className="w-16 h-24 rounded-lg bg-nascar-surface overflow-hidden flex-shrink-0">
        {driver.image ? (
          <img
            src={driver.image}
            alt={driver.fullName}
            className="w-full h-full object-contain"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-gray-500">
            {driver.number}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-white truncate">{driver.fullName}</h2>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-300">
          <span className="text-nascar-yellow font-bold">#{driver.number}</span>
          <span>{driver.team}</span>
          {driver.manufacturer && <span className="text-gray-400">{driver.manufacturer}</span>}
        </div>
      </div>
      {driver.carImage && (
        <div className="flex-shrink-0">
          <img
            src={driver.carImage}
            alt={`#${driver.number} car`}
            className="h-16 object-contain"
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}
