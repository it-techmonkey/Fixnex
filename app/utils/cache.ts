/**
 * Client-side caching utility with stale-while-revalidate pattern
 * Uses sessionStorage to persist data across page navigations
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

const CACHE_PREFIX = 'fixnex_cache_';
const DEFAULT_TTL = 30 * 1000; // 30 seconds default

/**
 * Get cached data if it exists and is not expired
 */
export function getCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) {
      return null;
    }

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now > entry.expiresAt) {
      sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.warn('Cache read error:', error);
    return null;
  }
}

/**
 * Set data in cache with optional TTL (time to live in milliseconds)
 */
export function setCachedData<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (typeof window === 'undefined') {
    return;
  }

  const now = Date.now();
  const entry: CacheEntry<T> = {
    data,
    timestamp: now,
    expiresAt: now + ttl,
  };

  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (error) {
    console.warn('Cache write error:', error);
    // If storage is full, try to clear old entries
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearExpiredCache();
      try {
        sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
      } catch (retryError) {
        console.warn('Cache write retry failed:', retryError);
      }
    }
  }
}

/**
 * Check if cached data exists and is still valid (not expired)
 */
export function isCacheValid(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const cached = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) {
      return false;
    }

    const entry: CacheEntry<unknown> = JSON.parse(cached);
    return Date.now() <= entry.expiresAt;
  } catch {
    return false;
  }
}

/**
 * Get cache timestamp to check how old the data is
 */
export function getCacheTimestamp(key: string): number | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) {
      return null;
    }

    const entry: CacheEntry<unknown> = JSON.parse(cached);
    return entry.timestamp;
  } catch {
    return null;
  }
}

/**
 * Remove specific cache entry
 */
export function removeCachedData(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.warn('Cache remove error:', error);
  }
}

/**
 * Clear all expired cache entries
 */
export function clearExpiredCache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keys = Object.keys(sessionStorage);
    const now = Date.now();

    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = sessionStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry<unknown> = JSON.parse(cached);
            if (now > entry.expiresAt) {
              sessionStorage.removeItem(key);
            }
          }
        } catch {
          // Invalid entry, remove it
          sessionStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn('Clear expired cache error:', error);
  }
}

/**
 * Clear all cache entries (including valid ones)
 */
export function clearAllCache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Clear all cache error:', error);
  }
}

/**
 * Fetch with cache - implements stale-while-revalidate pattern
 * Returns cached data immediately if available, then fetches fresh data in background
 */
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options?: {
    ttl?: number;
    useStaleWhileRevalidate?: boolean;
  }
): Promise<T> {
  const { ttl = DEFAULT_TTL, useStaleWhileRevalidate = true } = options || {};

  // Try to get cached data first
  const cached = getCachedData<T>(key);

  // If we have valid cache and not using stale-while-revalidate, return it
  if (cached !== null && !useStaleWhileRevalidate) {
    return cached;
  }

  // If using stale-while-revalidate and we have stale cache, return it immediately
  // and fetch fresh data in background
  if (cached !== null && useStaleWhileRevalidate) {
    // Fetch fresh data in background (don't await)
    fetchFn()
      .then((freshData) => {
        setCachedData(key, freshData, ttl);
      })
      .catch((error) => {
        console.warn('Background cache refresh failed:', error);
      });

    return cached;
  }

  // No cache available, fetch fresh data
  const freshData = await fetchFn();
  setCachedData(key, freshData, ttl);
  return freshData;
}

