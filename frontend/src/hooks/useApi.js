import { useState, useEffect, useCallback } from 'react';

export function useApi(url, options = {}) {
  const { enabled = true, deps = [] } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (enabled) fetchData();
  }, [fetchData, enabled, ...deps]);

  return { data, loading, error, refetch: fetchData };
}
