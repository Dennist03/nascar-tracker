const FLAG_MAP = {
  1: { label: 'GREEN', color: 'bg-flag-green', text: 'text-white' },
  2: { label: 'CAUTION', color: 'bg-flag-yellow', text: 'text-black' },
  3: { label: 'RED FLAG', color: 'bg-flag-red', text: 'text-white' },
  4: { label: 'CHECKERED', color: 'bg-white', text: 'text-black' },
  8: { label: 'PRE-RACE', color: 'bg-gray-600', text: 'text-white' },
  9: { label: 'NO SESSION', color: 'bg-gray-700', text: 'text-gray-300' },
};

export default function FlagStatus({ flagState }) {
  const flag = FLAG_MAP[flagState] || FLAG_MAP[9];

  return (
    <div className={`${flag.color} ${flag.text} rounded-lg px-4 py-2.5 text-center font-bold text-sm tracking-wider`}>
      {flag.label}
    </div>
  );
}
