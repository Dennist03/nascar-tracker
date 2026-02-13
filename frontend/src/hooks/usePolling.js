import { useState, useEffect, useRef, useCallback } from 'react';

export function usePolling(url, { activeInterval = 10000, inactiveInterval = 60000, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const visibleRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!enabled || !url) return;

    setLoading(true);
    fetchData();

    const isActive = data?.flag_state && ![8, 9, 0].includes(data.flag_state);
    const interval = isActive ? activeInterval : inactiveInterval;

    const startPolling = () => {
      clearInterval(intervalRef.current);
      if (visibleRef.current) {
        intervalRef.current = setInterval(fetchData, interval);
      }
    };

    const handleVisibility = () => {
      visibleRef.current = !document.hidden;
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        fetchData();
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [url, enabled, fetchData, activeInterval, inactiveInterval, data?.flag_state]);

  return { data, loading, error };
}
