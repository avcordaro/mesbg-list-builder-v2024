import { CachedStats, SharedStats } from "./types";

const STORAGE_KEY = "shared_stats";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export function getCachedStats(): CachedStats | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCachedStats(data: SharedStats) {
  const payload: CachedStats = {
    timestamp: Date.now(),
    data,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function isCacheValid(cache: CachedStats) {
  return Date.now() - cache.timestamp < CACHE_TTL;
}
