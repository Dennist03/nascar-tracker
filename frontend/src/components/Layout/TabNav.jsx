const tabs = [
  { id: 'live', label: 'Live', icon: '📡' },
  { id: 'races', label: 'Races', icon: '🏆' },
  { id: 'driver', label: 'My Driver', icon: '🏎️' },
];

export default function TabNav({ active, onChange }) {
  return (
    <>
      {/* Desktop: top tabs */}
      <nav className="hidden md:flex bg-nascar-card border-b border-nascar-surface">
        <div className="max-w-4xl mx-auto flex w-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                active === tab.id
                  ? 'text-nascar-yellow border-b-2 border-nascar-yellow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile: bottom tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-nascar-card border-t border-nascar-surface z-50">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 py-2 pt-2.5 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                active === tab.id
                  ? 'text-nascar-yellow'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
