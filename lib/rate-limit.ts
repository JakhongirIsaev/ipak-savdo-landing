type Entry = { count: number; resetAt: number };

export interface RateLimiterOptions {
  max: number;
  windowMs: number;
}

export interface RateLimiter {
  check(key: string | null): boolean;
}

export function createRateLimiter({ max, windowMs }: RateLimiterOptions): RateLimiter {
  const store = new Map<string, Entry>();
  return {
    check(key) {
      const k = key ?? "__shared__";
      const now = Date.now();
      const existing = store.get(k);
      if (!existing || existing.resetAt <= now) {
        store.set(k, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (existing.count >= max) {
        return false;
      }
      existing.count += 1;
      return true;
    },
  };
}

export const leadRateLimiter = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });
