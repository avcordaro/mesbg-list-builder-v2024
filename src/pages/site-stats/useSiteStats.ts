import { useEffect, useState } from "react";
import { getCachedStats, isCacheValid, setCachedStats } from "./stats-cache";
import { SharedStats } from "./types";

export function useSharedStats() {
  const [stats, setStats] = useState<SharedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = getCachedStats();

        if (cached) {
          setStats(cached.data);

          if (isCacheValid(cached)) {
            setLoading(false);
            return;
          }
        }

        const fresh = await fetchSharedStats();
        if (cancelled) return;

        setStats(fresh);
        setCachedStats(fresh);
      } catch {
        setError("Could not load stats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
}

async function fetchSharedStats(): Promise<SharedStats> {
  const res = await fetch(
    "https://api.mesbg-list-builder.com/v2024/shared/stats",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }

  return res.json();
}
