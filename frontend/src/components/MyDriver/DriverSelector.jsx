import { useState } from 'react';

export default function DriverSelector({ drivers, selected, onSelect }) {
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState('number'); // 'number' | 'alpha'
  const [open, setOpen] = useState(false);

  const sorted = [...(drivers || [])].sort((a, b) => {
    if (sortMode === 'number') {
      return (parseInt(a.number) || 999) - (parseInt(b.number) || 999);
    }
    return (a.lastName || '').localeCompare(b.lastName || '');
  });

  const filtered = sorted.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.fullName.toLowerCase().includes(q) ||
      String(d.number).includes(q) ||
      (d.team || '').toLowerCase().includes(q)
    );
  });

  const getSeriesBadge = (seriesShort) => {
    switch (seriesShort) {
      case 'Cup': return '🏆';
      case 'Xfinity': return '🟢';
      case 'Truck': return '🔵';
      default: return '';
    }
  };

  const formatDriver = (d) => {
    const badge = getSeriesBadge(d.seriesShort);
    const number = d.number || '—';

    if (sortMode === 'number') {
      return `${badge} #${number} - ${d.fullName}`;
    }
    return `${badge} ${d.lastName}, ${d.firstName} #${number}`;
  };

  return (
    <div className="relative">
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search driver by name or number..."
            value={search}
            onChange={e => { setSearch(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="w-full bg-nascar-surface border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-nascar-yellow"
          />
        </div>
        <button
          onClick={() => setSortMode(s => s === 'number' ? 'alpha' : 'number')}
          className="px-3 py-2 bg-nascar-surface border border-gray-600 rounded-lg text-sm text-nascar-yellow hover:bg-nascar-card transition whitespace-nowrap"
          title={sortMode === 'number' ? 'Sort by number' : 'Sort alphabetically'}
        >
          {sortMode === 'number' ? '#' : 'A-Z'}
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 w-full max-h-64 overflow-y-auto bg-nascar-card border border-gray-600 rounded-lg shadow-xl">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-gray-400 text-sm">No drivers found</div>
            ) : (
              filtered.map(d => (
                <button
                  key={d.id}
                  onClick={() => { onSelect(d); setOpen(false); setSearch(''); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-nascar-surface transition ${
                    selected?.id === d.id ? 'text-nascar-yellow bg-nascar-surface' : 'text-gray-200'
                  }`}
                >
                  {formatDriver(d)}
                  <span className="text-gray-500 ml-2 text-xs">{d.team}</span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
