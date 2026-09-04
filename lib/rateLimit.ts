import "server-only";

/**
 * Minimal in-memory fixed-window limiter for the login route. Good enough for
 * a single-instance deployment guarding a single admin password; not meant to
 * survive multi-instance scaling.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count += 1;
  return true;
}
