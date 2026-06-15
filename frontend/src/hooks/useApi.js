import { useState, useEffect, useCallback } from "react";

/**
 * Generic data-fetching hook.
 * @param {Function} apiFn  - async function that returns an axios response
 * @param {Array}    deps   - re-fetch when any dep changes
 * @param {boolean}  eager  - fetch immediately (default true)
 */
export const useApi = (apiFn, deps = [], eager = true) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(eager);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true); setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (eager) execute();
  }, [eager, ...deps]);

  return { data, loading, error, execute, setData };
};
