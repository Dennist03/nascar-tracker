export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-900/30 border border-nascar-red rounded-lg p-4 text-center">
      <p className="text-red-300 mb-2">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 bg-nascar-red text-white rounded text-sm hover:bg-red-700 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}
