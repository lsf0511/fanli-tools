import { useEffect, useState } from "react";
import type { TabData, TabKey } from "../types";

interface UseTabDataResult {
  data: TabData | null;
  loading: boolean;
  error: Error | null;
}

export function useTabData(key: TabKey): UseTabDataResult {
  const [data, setData] = useState<TabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/data/${key}.json`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed to load ${key}: ${r.status}`);
        return r.json();
      })
      .then((raw) => {
        if (cancelled) return;
        const withKey: TabData = { ...raw, key };
        setData(withKey);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { data, loading, error };
}
